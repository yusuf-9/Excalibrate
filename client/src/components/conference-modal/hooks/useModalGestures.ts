import { useCallback, useRef } from "react";
import {
  useAnimationControls,
  useDragControls,
  useMotionValue,
  useTransform,
} from "framer-motion";

// hooks
import { useWindowDimensions } from "@/hooks/useWindowDimensions"

// utils
import { getOffsets } from "@/utils";

// types
import { ModalpropTypes } from "../components";

export const useModalGestures = ({
  modalState,
  setModalState,
}: ModalpropTypes) => {


  // init state ------------------------------------------------------------------------------------------------------

  // get window dimensions
  const windowDimensions = useWindowDimensions();

  // get initials modal dimensions
  const initialModalWidth = windowDimensions?.width > 1100 ? 1100 : 700
  const initialModalHeight = windowDimensions?.height > 700 ? 700 : 400

  // init drag and animation controls
  const dragControls = useDragControls();
  const animationControls = useAnimationControls();

  // init motion values
  const widthMotionValue = useMotionValue(
    initialModalWidth
  );
  const heightMotionValue = useMotionValue(
    initialModalHeight
  );
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
      const newWidth = initialDims.current.width + info.offset.x
      const newHeight = initialDims.current.height + info.offset.y
      if(newWidth >= 300) {
        widthMotionValue.set(initialDims.current.width + info.offset.x);
      }
      if(newHeight >= 300) {
        heightMotionValue.set(initialDims.current.height + info.offset.y);
      }
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
      width: initialModalWidth,
      height: initialModalHeight,
      transition: { duration: 0.5, bounce: 1 },
    });
    initialDims.current = {
      width: initialModalWidth,
      height: initialModalHeight,
      isResizing: false,
    };
  }, [setModalState, modalState, animationControls, initialModalWidth, initialModalHeight]);

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
