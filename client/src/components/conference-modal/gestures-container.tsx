import { useCallback, useRef } from "react";
import { useAnimationControls, useDragControls, useMotionValue, useTransform } from "framer-motion";

// components
import ConferenceModal from "./gestures-modal";

// utils
import { getOffsets } from "@/utils";

// types
import { SetterOrUpdater } from "recoil";

type props = {
  modalState: {
    open: boolean;
    docked: boolean;
  };
  setModalState: SetterOrUpdater<{
    open: boolean;
    docked: boolean;
  }>;
};

const ModalGesturesContainer = ({ modalState, setModalState }: props) => {
  // init state ------------------------------------------------------------------------------------------------------
  
  // init drag and animation controls
  const dragControls = useDragControls();
  const animationControls = useAnimationControls();

  // init motion values
  const widthMotionValue = useMotionValue(900);
  const heightMotionValue = useMotionValue(700);
  const width = useTransform(widthMotionValue, latest => `${latest}px`);
  const height = useTransform(heightMotionValue, latest => `${latest}px`);

  // init refs
  const modalRefs = useRef<any>(null);
  const initialDims = useRef({ width: widthMotionValue.get(), height: heightMotionValue.get(), isResizing: false });

  // event handlers -------------------------------------------------------------------------------------------------

  const onPanStart = useCallback(
    (e: any) => {
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
      widthMotionValue.set(initialDims.current.width + info.offset.x);
      heightMotionValue.set(initialDims.current.height + info.offset.y);
    },
    [widthMotionValue, heightMotionValue]
  );

  const onPanEnd = useCallback(
    (e: any, info: any) =>
      (initialDims.current = {
        width: widthMotionValue.get(),
        height: heightMotionValue.get(),
        isResizing: true,
      }),
    [widthMotionValue, heightMotionValue]
  );

  const handleDrag = useCallback(
    (e: any, info?: any) => {
      if (!e.target.closest(".no-drag")) {
        dragControls.start(e);
      }
    },
    [dragControls]
  );

  const handleDockModal = useCallback(() => {
    setModalState({ ...modalState, open: true, docked: true });
    const modalContainer = modalRefs.current?.modalContainer;
    const modal = modalRefs.current?.modal;
    const { top, left } = getOffsets(modalContainer, modal);
    animationControls.start({ x: left - 300, y: top - 200, width: 300, height: 300, transition: { duration: 0.5, bounce: 1 } });
    initialDims.current = {
      width: 300,
      height: 300,
      isResizing: false,
    };
  }, [modalState, setModalState, animationControls]);

  const handleUndockModal = useCallback(() => {
    setModalState({ ...modalState, open: true, docked: false });
    animationControls.start({ x: 0, y: 0, width: 900, height: 700, transition: { duration: 0.5, bounce: 1 } });
    initialDims.current = {
      width: 900,
      height: 700,
      isResizing: false,
    };
  }, [modalState, setModalState, animationControls]);

  const handleCloseModal = useCallback(() => {
    setModalState(prev => ({ ...prev, open: false, docked: false }));
  }, [setModalState]);

  // render ----------------------------------------------------------------------------------------------------------

  const modalProps = {
    width,
    height,
    dragControls,
    docked: modalState.docked,
    animationControls,
    drag: true,
    dragListener: false,
    animate: animationControls,
    dragMomentum: false,
    dragSnapToOrigin: modalState.docked ? false : true,
    dragConstraints: modalState.docked ? modalRefs?.current?.modalContainer : false,
    dragElastic: 0.7,
    onPanStart,
    onPan,
    onPanEnd,
    handleDrag,
    handleDockModal,
    handleUndockModal,
    handleCloseModal,
    onMouseDown: handleDrag,
    onTouchStart: handleDrag,
    ref: modalRefs,
  };

  return <ConferenceModal {...modalProps} />;
};

export default ModalGesturesContainer;
