import { useCallback, useRef } from "react";
import {
  useAnimationControls,
  useDragControls,
  useMotionValue,
  useTransform,
} from "framer-motion";

// utils
import { getOffsets } from "@/utils";

// types
import { ModalpropTypes } from "../components";

export const useModalGestures = ({
  modalState,
  setModalState,
}: ModalpropTypes) => {
  // init state ------------------------------------------------------------------------------------------------------

  // init drag and animation controls
  const dragControls = useDragControls();
  const animationControls = useAnimationControls();

  // init motion values
  const widthMotionValue = useMotionValue(1100);
  const heightMotionValue = useMotionValue(700);
  const width = useTransform(
    widthMotionValue,
    latest => `${latest}px`
  );
  const height = useTransform(
    heightMotionValue,
    latest => `${latest}px`
  );

  // init refs
  const modalRefs = useRef<any>(null);
  const initialDims = useRef({
    width: widthMotionValue.get(),
    height: heightMotionValue.get(),
    isResizing: false,
  });

  // event handlers -------------------------------------------------------------------------------------------------

  const onPanStart = useCallback(
    (e: any, info: any) => {
      e.stopPropagation();
      e.preventDefault();
      initialDims.current = {
        width: widthMotionValue.get(),
        height: heightMotionValue.get(),
        isResizing: true,
      };
    },
    [widthMotionValue, heightMotionValue]
  );

  const onPan = useCallback(
    (e: any, info: any) => {
      e.stopPropagation();
      e.preventDefault();
      widthMotionValue.set(
        initialDims.current.width + info.offset.x
      );
      heightMotionValue.set(
        initialDims.current.height + info.offset.y
      );
    },
    [widthMotionValue, heightMotionValue]
  );

  const onPanEnd = useCallback(
    () =>
      (initialDims.current = {
        width: widthMotionValue.get(),
        height: heightMotionValue.get(),
        isResizing: true,
      }),
    [widthMotionValue, heightMotionValue]
  );

  const handleDrag = useCallback(
    (e: any) => {
      if (!e.target.closest(".no-drag")) {
        dragControls.start(e);
      }
    },
    [dragControls]
  );

  const handleDockModal = useCallback(() => {
    setModalState({
      ...modalState,
      open: true,
      docked: true,
    });
    const modalContainer =
      modalRefs.current?.modalContainer;
    const modal = modalRefs.current?.modal;
    const { top, left } = getOffsets(modalContainer, modal);
    animationControls.start({
      x: left - 400,
      y: top - 200,
      width: 300,
      height: 300,
      transition: { duration: 0.5, bounce: 1 },
    });
    initialDims.current = {
      width: 300,
      height: 300,
      isResizing: false,
    };
  }, [modalState, setModalState, animationControls]);

  const handleUndockModal = useCallback(() => {
    setModalState({
      ...modalState,
      open: true,
      docked: false,
    });
    animationControls.start({
      x: 0,
      y: 0,
      width: 1100,
      height: 700,
      transition: { duration: 0.5, bounce: 1 },
    });
    initialDims.current = {
      width: 1100,
      height: 700,
      isResizing: false,
    };
  }, [modalState, setModalState, animationControls]);

  const handleCloseModal = useCallback(() => {
    setModalState((prev: any) => ({
      ...prev,
      open: false,
      docked: false,
    }));
  }, [setModalState]);

  return {
    width,
    height,
    dragControls,
    animationControls,
    onPanStart,
    onPan,
    onPanEnd,
    handleDrag,
    handleDockModal,
    handleUndockModal,
    handleCloseModal,
    modalRefs
  }
};
