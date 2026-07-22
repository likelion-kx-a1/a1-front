"use client";

/** 비디오 생성 화면 — 독립 라우트(/video)와 프로젝트 라우트(/project/[projectId]/video)에서 재사용 */

import { useEffect, useMemo, useRef, useState } from "react";
import CloseIcon from "@/components/icons/CloseIcon";
import CopyIcon from "@/components/icons/CopyIcon";
import DownloadIcon from "@/components/icons/DownloadIcon";
import GenerateButton from "@/features/generation/components/GenerateButton";
import PromptRefineToggle from "@/features/generation/components/PromptRefineToggle";
import ImagePlusIcon from "@/components/icons/ImagePlusIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import VideoIcon from "@/components/icons/VideoIcon";
import DurationInput from "@/features/generation/components/DurationInput";
import FrameCard from "@/features/generation/components/FrameCard";
import FrameSlot from "@/features/generation/components/FrameSlot";
import Button from "@/components/ui/Button";
import GeneratingSpinner from "@/components/ui/GeneratingSpinner";
import Modal from "@/components/ui/Modal";
import OptionDropdown from "@/components/ui/OptionDropdown";
import GenerationWorkspaceLayout from "@/components/layout/GenerationWorkspaceLayout";
import AuthModal from "@/features/auth/components/AuthModal";
import SaveProjectPickerModal from "@/features/library/components/SaveProjectPickerModal";
import { useVideoGeneration } from "@/hooks/useVideoGeneration";
import { useSaveToLibrary } from "@/hooks/useMedia";
import GenerationTypeDropdown from "@/features/generation/components/GenerationTypeDropdown";
import { RATIO_OPTIONS, RESOLUTION_OPTIONS } from "@/lib/generationTypes";
import { buildSaveDisplayName } from "@/lib/media";
import {
  buildMediaFilename,
  copyTextToClipboard,
  copyVideoToClipboard,
  downloadFromUrl,
} from "@/lib/mediaActions";
import { useAuthStore } from "@/stores/authStore";

interface VideoGenerationViewProps {
  /** 이 화면이 속한 프로젝트 ID. 없으면 프로젝트와 무관한 독립 채팅으로 생성 */
  projectId?: number;
}

const MAX_FRAMES = 9;

export default function VideoGenerationView({ projectId }: VideoGenerationViewProps) {
  const user = useAuthStore((s) => s.user);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [ratio, setRatio] = useState("1:1");
  const [resolution, setResolution] = useState("720p");
  const [duration, setDuration] = useState("");
  const [refinePrompt, setRefinePrompt] = useState(false);
  const [prompt, setPrompt] = useState("");

  const [frameModalOpen, setFrameModalOpen] = useState(false);
  const [frames, setFrames] = useState<File[]>([]);
  /** 모달 안에서만 편집 — "완료" 눌러야 frames에 반영 */
  const [draftFrames, setDraftFrames] = useState<File[]>([]);
  /** 모달에 펼쳐 보이는 슬롯 수 — 3개로 시작해 "+"로 MAX_FRAMES까지 늘린다 */
  const [visibleSlots, setVisibleSlots] = useState(3);
  const fileInputRef = useRef<HTMLInputElement>(null);
  /** 파일 선택창을 연 슬롯 인덱스 — null이면 새로 추가, 값이 있으면 해당 프레임 교체 */
  const replaceIndexRef = useRef<number | null>(null);

  const [submittedPrompt, setSubmittedPrompt] = useState("");
  const [submittedFrames, setSubmittedFrames] = useState<File[]>([]);
  const [copied, setCopied] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [actionPending, setActionPending] = useState(false);
  const generation = useVideoGeneration(projectId);
  const saveToLibrary = useSaveToLibrary(projectId);

  const framePreviews = useMemo(() => frames.map((file) => URL.createObjectURL(file)), [frames]);
  const draftPreviews = useMemo(
    () => draftFrames.map((file) => URL.createObjectURL(file)),
    [draftFrames],
  );
  const submittedFramePreviews = useMemo(
    () => submittedFrames.map((file) => URL.createObjectURL(file)),
    [submittedFrames],
  );

  useEffect(() => {
    return () => {
      framePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [framePreviews]);

  useEffect(() => {
    return () => {
      draftPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [draftPreviews]);

  useEffect(() => {
    return () => {
      submittedFramePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [submittedFramePreviews]);

  const requireAuth = (action: () => void) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    action();
  };

  const handlePromptClick = () => {
    if (!user) {
      setAuthModalOpen(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const replaceIndex = replaceIndexRef.current;
      setDraftFrames((prev) => {
        if (replaceIndex !== null) {
          return prev.map((f, i) => (i === replaceIndex ? file : f));
        }
        return prev.length < MAX_FRAMES ? [...prev, file] : prev;
      });
    }
    replaceIndexRef.current = null;
    e.target.value = "";
  };

  const openFilePicker = (index: number | null) => {
    replaceIndexRef.current = index;
    fileInputRef.current?.click();
  };

  const handleRemoveFrame = (index: number) => {
    setFrames((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveDraftFrame = (index: number) => {
    setDraftFrames((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOpenFrameModal = () =>
    requireAuth(() => {
      setDraftFrames(frames);
      setFrameModalOpen(true);
    });

  const handleConfirmFrames = () => {
    setFrames(draftFrames);
    setFrameModalOpen(false);
  };

  const handleGenerate = () => {
    requireAuth(() => {
      const trimmedPrompt = prompt.trim();
      if (!trimmedPrompt) {
        return;
      }
      setSubmittedPrompt(trimmedPrompt);
      setSubmittedFrames(frames);
      setPrompt("");
      generation.mutate({ prompt: trimmedPrompt, frames });
    });
  };

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(submittedPrompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const showActionMessage = (message: string) => {
    setActionMessage(message);
    window.setTimeout(() => setActionMessage(""), 2000);
  };

  const videoUrl = generation.isSuccess ? generation.data.videoUrl : null;
  const mediaId = generation.isSuccess ? generation.data.mediaId : null;

  /** 저장 — 라이브러리(마이페이지)에 등록 */
  const handleSaveVideo = async () => {
    if (!mediaId) {
      return;
    }
    setActionPending(true);
    try {
      const res = await saveToLibrary.save({
        mediaId,
        displayName: buildSaveDisplayName(submittedPrompt, "생성 비디오"),
      });
      if (res) {
        showActionMessage("라이브러리에 저장되었습니다.");
      }
    } catch {
      showActionMessage("라이브러리 저장에 실패했습니다.");
    } finally {
      setActionPending(false);
    }
  };

  const handleConfirmSaveProject = async (selectedProjectId: number) => {
    setActionPending(true);
    try {
      await saveToLibrary.confirmProject(selectedProjectId);
      showActionMessage("라이브러리에 저장되었습니다.");
    } catch {
      showActionMessage("라이브러리 저장에 실패했습니다.");
    } finally {
      setActionPending(false);
    }
  };

  /** 복사 — 비디오 복사 (실패 시 URL 복사) */
  const handleCopyVideo = async () => {
    if (!videoUrl) {
      return;
    }
    setActionPending(true);
    try {
      const mode = await copyVideoToClipboard(videoUrl);
      showActionMessage(
        mode === "video" ? "비디오가 복사되었습니다." : "비디오 링크가 복사되었습니다.",
      );
    } catch {
      try {
        await copyTextToClipboard(videoUrl);
        showActionMessage("비디오 링크가 복사되었습니다.");
      } catch {
        showActionMessage("복사에 실패했습니다.");
      }
    } finally {
      setActionPending(false);
    }
  };

  /** 다운로드 — 비디오 파일 다운로드 */
  const handleDownloadVideo = async () => {
    if (!videoUrl) {
      return;
    }
    setActionPending(true);
    try {
      await downloadFromUrl(videoUrl, buildMediaFilename(submittedPrompt, "mp4"));
      showActionMessage("다운로드를 시작했습니다.");
    } catch {
      showActionMessage("다운로드에 실패했습니다.");
    } finally {
      setActionPending(false);
    }
  };

  return (
    <GenerationWorkspaceLayout projectId={projectId}>
      <div className="flex h-full min-h-0 flex-col items-center justify-end gap-6 py-10">
        {/* 결과 / 빈 캔버스 — 상태 안내는 안쪽 role=status/alert가 맡는다
          (이 section에 aria-live를 걸면 중복 안내가 된다) */}
        {submittedPrompt ? (
          <section
            aria-label="비디오 생성 결과"
            className="-mx-8 flex w-full flex-1 flex-col items-end justify-end gap-4 overflow-y-auto px-10"
          >
            {generation.isSuccess ? (
              <figure className="group relative h-[450px] w-full max-w-[800px]">
                <video
                  src={generation.data.videoUrl}
                  controls
                  playsInline
                  className="size-full rounded-2xl bg-[#222] object-contain p-[10px]"
                >
                  <track kind="captions" />
                </video>
                <figcaption className="sr-only">생성된 결과 비디오</figcaption>
                <div
                  role="toolbar"
                  aria-label="결과 비디오 액션"
                  className="absolute right-4 bottom-4 flex gap-4 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <button
                    type="button"
                    onClick={handleSaveVideo}
                    disabled={actionPending || saveToLibrary.isPending}
                    aria-label="라이브러리에 저장"
                    className="flex h-12 items-center justify-center rounded-lg bg-[#333] px-6 text-base text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    저장
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyVideo}
                    disabled={actionPending}
                    aria-label="비디오 복사"
                    className="flex size-12 items-center justify-center rounded-lg bg-[#333] text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CopyIcon className="size-6" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadVideo}
                    disabled={actionPending}
                    aria-label="비디오 다운로드"
                    className="flex size-12 items-center justify-center rounded-lg bg-[#333] text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <DownloadIcon className="size-6" aria-hidden />
                  </button>
                </div>
                {actionMessage && (
                  <p
                    role="status"
                    className="absolute bottom-4 left-4 rounded-lg bg-black/70 px-3 py-2 text-sm text-white"
                  >
                    {actionMessage}
                  </p>
                )}
              </figure>
            ) : generation.isError ? (
              <div
                role="alert"
                className="flex h-[450px] w-full max-w-[800px] items-center justify-center rounded-2xl bg-[#222] p-6 text-center text-red-400"
              >
                {generation.error.message}
              </div>
            ) : (
              <GeneratingSpinner isGenerating={generation.isPending} label="비디오" />
            )}

            {/* 보낸 프레임 + 프롬프트 */}
            <article
              aria-label="제출한 프롬프트"
              className="flex w-full max-w-[1000px] flex-col items-end gap-6 rounded-lg bg-[#222] p-6"
            >
              {submittedFramePreviews.length > 0 && (
                <ul className="flex w-full flex-wrap gap-4" aria-label="제출한 프레임">
                  {submittedFramePreviews.map((src, i) => (
                    <li
                      key={src}
                      className="h-16 w-28 shrink-0 overflow-hidden rounded-md bg-[#444]"
                    >
                      <img
                        src={src}
                        alt={
                          i === 0
                            ? "시작 프레임"
                            : i === submittedFramePreviews.length - 1
                              ? "마지막 프레임"
                              : `프레임 ${i + 1}`
                        }
                        className="size-full object-cover"
                      />
                    </li>
                  ))}
                </ul>
              )}
              <p className="w-full text-xl leading-[1.5] tracking-[-0.4px] text-white">
                {submittedPrompt}
              </p>
              <button
                type="button"
                aria-label={copied ? "복사됨" : "프롬프트 복사"}
                onClick={handleCopyPrompt}
                className="flex size-12 items-center justify-center rounded-lg bg-[#333] text-white"
              >
                <CopyIcon className="size-6" aria-hidden />
              </button>
            </article>
          </section>
        ) : (
          <section
            aria-label="비디오 생성 캔버스"
            className="-mx-8 flex min-h-[300px] w-full flex-1 items-center justify-center overflow-hidden bg-[#222]"
          >
            <p aria-hidden className="text-[40px] font-semibold text-white/10">
              튜토리얼
            </p>
          </section>
        )}

        {/* 설정 패널 */}
        <section
          aria-label="비디오 생성 설정"
          className="flex w-full max-w-[1200px] shrink-0 flex-col items-start gap-4 p-6"
        >
          <GenerationTypeDropdown current="비디오 생성" projectId={projectId} />

          <div className="flex w-full flex-col gap-6 rounded-2xl bg-[#333] p-6">
            <fieldset className="flex w-full items-center gap-4 border-0 p-0">
              <legend className="sr-only">프레임 설정</legend>

              {framePreviews.length === 0 ? (
                <>
                  <FrameCard
                    filled
                    label="시작 프레임"
                    icon={<ImagePlusIcon className="size-6 text-[#bfc7d6]" strokeWidth={2} />}
                  />
                  <FrameCard
                    label="마지막 프레임"
                    icon={<ImagePlusIcon className="size-6 text-[#bfc7d6]" strokeWidth={2} />}
                  />
                </>
              ) : (
                <ul aria-label="선택한 프레임" className="flex items-center gap-4">
                  {framePreviews.map((src, i) => (
                    <li
                      key={src}
                      className="group relative h-20 w-[120px] shrink-0 overflow-hidden rounded-lg bg-[#262c3b]"
                    >
                      <img
                        src={src}
                        alt={
                          i === 0
                            ? "시작 프레임"
                            : i === framePreviews.length - 1
                              ? "마지막 프레임"
                              : `프레임 ${i + 1}`
                        }
                        className="size-full object-cover"
                      />
                      <button
                        type="button"
                        aria-label="프레임 삭제"
                        onClick={() => handleRemoveFrame(i)}
                        className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <CloseIcon className="size-4" aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <FrameCard
                label="프레임 추가"
                onClick={handleOpenFrameModal}
                icon={<PlusIcon className="size-6 text-[#bfc7d6]" aria-hidden />}
              />

              {/* TODO: 참조 이미지 선택 핸들러 연결 — 지금은 시안 배치만 */}
              <FrameCard
                label="참조 이미지"
                hint
                icon={<PlusIcon className="size-6 text-[#bfc7d6]" aria-hidden />}
              />

              <FrameCard
                label="스토리보드 불러오기"
                disabled
                onClick={() => {}}
                title="준비 중인 기능입니다"
                icon={<VideoIcon className="size-6 text-[#bfc7d6]" strokeWidth={2} aria-hidden />}
              />
            </fieldset>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onClick={handlePromptClick}
              readOnly={!user}
              placeholder={"이미지를 설명해주세요\n참고 이미지를 추가해 완성도를 높여보세요"}
              aria-label="비디오 생성 프롬프트"
              className="h-[90px] w-full resize-none text-xl leading-[1.5] text-white placeholder:text-[#999] focus:outline-none focus:placeholder:text-transparent"
            />
          </div>

          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-4 rounded-lg" role="group" aria-label="생성 옵션">
              <OptionDropdown
                options={RATIO_OPTIONS}
                value={ratio}
                onChange={setRatio}
                label="비율"
                variant="card"
                size="md"
                direction="up"
              />
              <OptionDropdown
                options={RESOLUTION_OPTIONS}
                value={resolution}
                onChange={setResolution}
                label="해상도"
                variant="card"
                size="md"
                listIcon={false}
                labelWidth="w-12"
                descriptionWidth="w-10"
                itemClassName="h-auto p-4"
                direction="up"
              />

              <DurationInput value={duration} onChange={setDuration} />
            </div>

            <div className="flex items-center gap-4">
              <PromptRefineToggle checked={refinePrompt} onChange={setRefinePrompt} />
              <GenerateButton
                onClick={handleGenerate}
                disabled={!prompt.trim() || generation.isPending}
              />
            </div>
          </div>
        </section>

        <Modal
          open={frameModalOpen}
          onClose={() => setFrameModalOpen(false)}
          label="프레임 추가"
          // 테두리를 border로 주면 폭을 차지해 슬롯이 한 줄에 3개가 안 들어간다 (시안도 outline)
          className="w-[604px] max-w-full rounded-2xl border-0 bg-[#1c1f2a] outline-2 -outline-offset-2 outline-[#394257]"
        >
          <div className="flex flex-col gap-4 p-4">
            {/* 제목은 화면에 안 띄우되 문서 구조상 남겨둔다 (dialog의 aria-label과 같은 문구) */}
            <h2 className="sr-only">프레임 추가</h2>


            <ul className="grid grid-cols-3 gap-4">
              {Array.from({ length: visibleSlots }, (_, i) => (
                <FrameSlot
                  key={draftPreviews[i] ?? `empty-${i}`}
                  position={i + 1}
                  previewUrl={draftPreviews[i]}
                  onSelect={() => openFilePicker(draftPreviews[i] ? i : null)}
                  onRemove={() => handleRemoveDraftFrame(i)}
                  onAddSlot={
                    i === visibleSlots - 1 && visibleSlots < MAX_FRAMES
                      ? () => setVisibleSlots((prev) => Math.min(MAX_FRAMES, prev + 1))
                      : undefined
                  }
                />
              ))}
            </ul>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
              aria-hidden
              tabIndex={-1}
            />

            <Button type="button" onClick={handleConfirmFrames} className="h-12 w-full text-lg">
              완료
            </Button>
          </div>
        </Modal>

        <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        <SaveProjectPickerModal
          open={saveToLibrary.pickerOpen}
          onClose={saveToLibrary.cancelPicker}
          onSelect={handleConfirmSaveProject}
          pending={actionPending}
        />
      </div>
    </GenerationWorkspaceLayout>
  );
}
