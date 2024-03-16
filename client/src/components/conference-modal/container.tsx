import { useRecoilState } from "recoil";

// store
import { useStore } from "@/hooks/useStore";

// components
import ModalGestureContainer from "./gestures-container";

const ModalContainer = () => {
  const { conferenceModalAtom } = useStore();
  const [modalState, setModalState] = useRecoilState(conferenceModalAtom);

  return modalState.open && <ModalGestureContainer modalState={modalState} setModalState={setModalState} />;
};

export default ModalContainer;
