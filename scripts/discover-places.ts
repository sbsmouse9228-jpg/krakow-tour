/**
 * 주기적으로 실행되는 AI 명소 발굴 스크립트.
 *
 * 1단계: Claude에게 web_search tool을 주고 크라쿠프의 신규 명소/맛집/카페를 조사시킨다.
 * 2단계: 조사 결과를 output_config.format(JSON Schema)으로 구조화해 pending_places에 저장한다.
 * (바로 places에 반영하지 않고 관리자 승인을 거치도록 pending_places에만 적재한다)
 */
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 환경변수가 필요합니다.');
}
if (!ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY 환경변수가 필요합니다.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

const MODEL = 'claude-opus-5';

const CANDIDATE_SCHEMA = {
  type: 'object',
  properties: {
    places: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', description: '영문 표기 이름' },
          name_local: { type: ['string', 'null'], description: '폴란드어 등 현지어 이름' },
          category: {
            type: 'string',
            enum: ['landmark', 'museum', 'church', 'park', 'food', 'cafe'],
          },
          description: { type: 'string', description: '1~2문장 영문 설명' },
          address: { type: 'string' },
          lat: { type: 'number' },
          lng: { type: 'number' },
          tags: { type: 'array', items: { type: 'string' } },
          source_notes: { type: 'string', description: '이 장소를 제안한 근거(출처 요약)' },
        },
        required: [
          'name',
          'name_local',
          'category',
          'description',
          'address',
          'lat',
          'lng',
          'tags',
          'source_notes',
        ],
        additionalProperties: false,
      },
    },
  },
  required: ['places'],
  additionalProperties: false,
} as const;

async function fetchKnownPlaceNames(): Promise<string[]> {
  const [places, pending] = await Promise.all([
    supabase.from('places').select('name'),
    supabase.from('pending_places').select('name').eq('status', 'pending'),
  ]);
  if (places.error) throw places.error;
  if (pending.error) throw pending.error;
  return [...(places.data ?? []), ...(pending.data ?? [])].map((row) => row.name);
}

async function researchNewPlaces(knownNames: string[]): Promise<string> {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 8000,
    output_config: { effort: 'medium' },
    tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 8 }],
    system:
      'You are a travel research assistant for a Kraków (Poland) tourist guide app. ' +
      'Research real, currently operating sights, restaurants, or cafes in Kraków that are ' +
      'NOT already in the provided list. Use web search to verify each place actually exists ' +
      '(name, address, rough coordinates). Prefer places with some popularity or notable reviews. ' +
      'Find at most 5 candidates. For each, write its name, local name if known, category ' +
      '(landmark/museum/church/park/food/cafe), a short description, address, approximate ' +
      'latitude/longitude, a few tags, and a one-line note on where you found this information.',
    messages: [
      {
        role: 'user',
        content:
          'Already known places (do not repeat these):\n' +
          knownNames.map((n) => `- ${n}`).join('\n') +
          '\n\nFind new Kraków sights, restaurants, or cafes not in this list.',
      },
    ],
  });

  let text = '';
  for (const block of response.content) {
    if (block.type === 'text') text += block.text;
  }
  return text;
}

interface Candidate {
  name: string;
  name_local: string | null;
  category: 'landmark' | 'museum' | 'church' | 'park' | 'food' | 'cafe';
  description: string;
  address: string;
  lat: number;
  lng: number;
  tags: string[];
  source_notes: string;
}

async function structurePlaces(researchText: string): Promise<Candidate[]> {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4000,
    output_config: {
      effort: 'low',
      format: { type: 'json_schema', schema: CANDIDATE_SCHEMA },
    },
    messages: [
      {
        role: 'user',
        content:
          'Convert the following research notes into the structured place list. ' +
          'If no real new places were found, return an empty "places" array.\n\n' +
          researchText,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') return [];
  const parsed = JSON.parse(textBlock.text) as { places: Candidate[] };
  return parsed.places;
}

async function main() {
  console.log('[discover-places] 기존 장소 목록 조회 중...');
  const knownNames = await fetchKnownPlaceNames();
  console.log(`[discover-places] 기존 장소 ${knownNames.length}개 확인`);

  console.log('[discover-places] Claude 웹 검색으로 신규 장소 조사 중...');
  const researchText = await researchNewPlaces(knownNames);

  console.log('[discover-places] 조사 결과를 구조화된 데이터로 변환 중...');
  const candidates = await structurePlaces(researchText);

  if (candidates.length === 0) {
    console.log('[discover-places] 새로 발굴된 장소가 없습니다.');
    return;
  }

  const rows = candidates.map((c) => ({
    name: c.name,
    name_local: c.name_local,
    category: c.category,
    description: c.description,
    address: c.address,
    lat: c.lat,
    lng: c.lng,
    tags: c.tags,
    status: 'pending' as const,
    source: 'ai-discovery',
    source_notes: c.source_notes,
  }));

  const { error } = await supabase.from('pending_places').insert(rows);
  if (error) throw error;

  console.log(`[discover-places] ${rows.length}개 장소를 pending_places에 등록했습니다:`);
  for (const row of rows) console.log(`  - ${row.name} (${row.category})`);
}

main().catch((error) => {
  console.error('[discover-places] 실패:', error);
  process.exit(1);
});
