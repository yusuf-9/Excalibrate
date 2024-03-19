// components
import ConferenceModal from "./component";

// types
import { SetterOrUpdater } from "recoil";
import { ModalpropTypes } from "..";
import { useModalGestures } from "../../hooks/useModalGestures";

type props = ModalpropTypes & {
  modalState: {
    open: boolean;
    docked: boolean;
  };
  setModalState: SetterOrUpdater<{
    open: boolean;
    docked: boolean;
  }>;
  children: React.ReactNode
};

const ModalGesturesContainer = ({ modalState, setModalState, children }: props) => {

  const {
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
  } = useModalGestures({
    modalState,
    setModalState
  })

  return <ConferenceModal {...{
    children,
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
  }} />;
};

export default ModalGesturesContainer;
