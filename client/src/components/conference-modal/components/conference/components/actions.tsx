import { motion } from "framer-motion";

function ConferenceActions() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full flex gap-5 justify-center items-center -mb-5"
    >
      <button className="bg-red-800 text-white p-2 rounded-md">End</button>
      <button className="bg-gray-600 text-white p-2 rounded-md">Mute</button>
      <button className="bg-green-500 text-white p-2 rounded-md">Hide Video</button>
    </motion.div>
  );
}

export default ConferenceActions;
