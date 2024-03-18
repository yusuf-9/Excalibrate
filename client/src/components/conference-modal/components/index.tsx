import { SetterOrUpdater } from "recoil";

// components
import ModalGestures from "./gestures";
import ModalConference from "./conference";

// types
export type ModalpropTypes = {
  modalState: {
    open: boolean;
    docked: boolean;
  };
  setModalState: SetterOrUpdater<{
    open: boolean;
    docked: boolean;
  }>;
};

const ConferenceModal = ({
  modalState,
  setModalState,
}: ModalpropTypes) => {
  return (
    <ModalGestures
      modalState={modalState}
      setModalState={setModalState}
    >
      <ModalConference />
    </ModalGestures>
  );
};

export default ConferenceModal;
