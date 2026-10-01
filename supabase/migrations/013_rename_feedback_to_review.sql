-- =============================================
-- feedback -> reviews 명칭 변경 및 전체 공개 조회 허용
-- =============================================
alter table public.feedback rename to reviews;
alter index feedback_place_idx rename to reviews_place_idx;
comment on table public.reviews is '사용자가 장소에 대해 남긴 리뷰';

drop policy "피드백 등록 공개 허용" on public.reviews;
drop policy "인증된 사용자 피드백 조회" on public.reviews;

create policy "리뷰 등록 공개 허용"
  on public.reviews for insert
  with check (true);

create policy "리뷰 전체 공개 조회"
  on public.reviews for select
  using (true);
