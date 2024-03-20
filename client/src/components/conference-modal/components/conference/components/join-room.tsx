type Props = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

function JoinRoom(props: Props) {
  const { onClick } = props;

  return (
    <section className={`w-full flex-grow flex flex-col justify-center items-center gap-2`}>
      <h1 className="text-3xl">There's no one here...</h1>
      <button
        className="bg-accent-dark hover:bg-accent-darker text-white text-lg py-1 px-5 rounded-md"
        onClick={onClick}
      >
        Begin a call
      </button>
    </section>
  );
}

export default JoinRoom;
