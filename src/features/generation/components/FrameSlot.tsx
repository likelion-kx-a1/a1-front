import CloseIcon from "@/components/icons/CloseIcon";
import ImagePlusIcon from "@/components/icons/ImagePlusIcon";
import PlusIcon from "@/components/icons/PlusIcon";

interface FrameSlotProps {
  /** 1부터 세는 슬롯 번호 */
  position: number;
  /** 채워졌을 때의 미리보기 URL. 없으면 빈 슬롯 */
  previewUrl?: string;
  /** 클릭 시 파일 선택 열기 (빈 슬롯은 추가, 채워진 슬롯은 교체) */
  onSelect: () => void;
  onRemove: () => void;
  /** 주면 이 슬롯 오른쪽에 "슬롯 늘리기" 버튼 */
  onAddSlot?: () => void;
}

// 폭은 격자 칸에 맡긴다 (3열 × 180px)
const BOX = "h-[101px] w-full overflow-hidden rounded-lg";

/** 프레임 추가 모달의 슬롯 한 칸 — 비어 있으면 추가 버튼, 채워지면 미리보기 + 삭제 */
export default function FrameSlot({
  position,
  previewUrl,
  onSelect,
  onRemove,
  onAddSlot,
}: FrameSlotProps) {
  return (
    // 삭제·슬롯추가 버튼이 카드 밖으로 튀어나오므로 li를 기준으로(버튼 중첩은 불가)
    <li className="relative shrink-0">
      {previewUrl ? (
        <>
          <button
            type="button"
            onClick={onSelect}
            aria-label={`${position}번 프레임 이미지 변경`}
            className={`${BOX} group relative block bg-[#555]`}
          >
            <img src={previewUrl} alt={`${position}번 프레임`} className="size-full object-cover" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-base text-white opacity-0 transition-opacity group-hover:opacity-100">
              변경
            </span>
          </button>

          <button
            type="button"
            onClick={onRemove}
            aria-label={`${position}번 프레임 삭제`}
            className="absolute -top-2.5 -right-2.5 flex size-6 items-center justify-center rounded-full bg-[#bfc7d6] text-black"
          >
            <CloseIcon className="size-4" aria-hidden />
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={onSelect}
          aria-label={`${position}번 프레임 이미지 추가`}
          className={`${BOX} flex flex-col items-center justify-center gap-2 border border-[#394257] bg-[#1c1f2a]`}
        >
          <ImagePlusIcon className="size-6 text-[#bfc7d6]" strokeWidth={2} aria-hidden />
          <span className="text-[13px] leading-[1.5] tracking-[-0.26px] text-[#bfc7d6]">
            클릭하여 이미지 추가
          </span>
        </button>
      )}

      {onAddSlot && (
        <button
          type="button"
          onClick={onAddSlot}
          aria-label="프레임 슬롯 추가"
          className="absolute top-1/2 -right-4 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#262c3b] text-[#bfc7d6]"
        >
          <PlusIcon className="size-5" aria-hidden />
        </button>
      )}
    </li>
  );
}
