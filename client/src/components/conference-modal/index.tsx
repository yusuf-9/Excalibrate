import { useRecoilState } from "recoil";

// store
import { useStore } from "@/hooks/useStore";

// components
import ConferenceModal from "./components";

const ModalContainer = () => {
  const { conferenceModalAtom } = useStore();
  const [modalState, setModalState] = useRecoilState(conferenceModalAtom);

  return modalState.open && <ConferenceModal modalState={modalState} setModalState={setModalState} />;
};

export default ModalContainer;
