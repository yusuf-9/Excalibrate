import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import {
  AnimationControls,
  DragControls,
  MotionValue,
  motion,
} from "framer-motion";

// icons
import { IoMdResize } from "react-icons/io";
import { ImEnlarge } from "react-icons/im";
import { TbWindowMinimize } from "react-icons/tb";

// utils
import { join } from "@/utils";

// component props type
type modalPropType = {
  docked: boolean;
  width: MotionValue<string>;
  height: MotionValue<string>;
  dragControls: DragControls;
  animationControls: AnimationControls;
  children: React.ReactNode;
  onPanStart: (e: any, info: any) => void;
  onPan: (e: any, info: any) => void;
  onPanEnd: (e: any, info: any) => void;
  handleDrag: (e: any, info?: any) => void;
  handleDockModal: () => void;
  handleUndockModal: () => void;
  handleCloseModal: () => void;
};

const ConferenceModal = forwardRef(
  (props: modalPropType, ref: any) => {
    const {
      children,
      docked,
      width,
      height,
      onPanStart,
      onPan,
      onPanEnd,
      handleDockModal,
      handleUndockModal,
      ...modalProps
    } = props;

    const modalContainerRef = useRef(null);
    const modalRef = useRef(null);

    useImperativeHandle(ref, () => ({
      get modalContainer() {
        return modalContainerRef.current;
      },
      get modal() {
        return modalRef.current;
      },
    }));

    const modalControls = useMemo(
      () => (
        <>
          {docked && (
            <>
              <ImEnlarge
                className="absolute z-[1600] right-0 top-0 m-2 cursor-pointer h-4 w-4"
                onClick={handleUndockModal}
              />
              <motion.div
                onPanStart={onPanStart}
                onPan={onPan}
                onPanEnd={onPanEnd}
                className="z-[1600] absolute right-2 bottom-2 cursor-pointer no-drag"
              >
                <IoMdResize className="-rotate-90 h-4 w-4 no-drag" />
              </motion.div>
            </>
          )}
          {!docked && (
            <TbWindowMinimize
              className="absolute z-[1600] right-0 top-0 m-2 cursor-pointer h-5 w-5"
              onClick={handleDockModal}
            />
          )}
        </>
      ),
      [
        docked,
        handleUndockModal,
        handleDockModal,
        onPanStart,
        onPan,
        onPanEnd,
      ]
    );

    return (
      <div
        ref={modalContainerRef}
        className={join(
          docked
            ? "pointer-events-none"
            : "before:bg-black before:opacity-50 before:z-[1000]",
          "absolute z-[1000] left-0 top-0 right-0 bottom-0 bg-transparent w-screen h-screen flex justify-center items-center before:content-[''] before:absolute before:left-0 before:top-0 before:right-0 before:bottom-0"
        )}
      >
        <motion.div
          ref={modalRef}
          style={{ touchAction: "none", width, height }}
          className="p-10 rounded-xl shadow-lg bg-white z-[1500] opacity-100 pointer-events-auto relative"
          {...modalProps}
        >
          {children}
          {modalControls}
        </motion.div>
      </div>
    );
  }
);

ConferenceModal.displayName = "ConferenceModal"; // Add display name

export default ConferenceModal;
