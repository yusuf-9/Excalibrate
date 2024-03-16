import React, { useState } from "react";

// styles
import { classes } from "./styles";

// hooks
import { useUser } from "@/hooks/useUser";


const WelcomeForm = ({
  searchParams,
}: {
  searchParams?: URLSearchParams
}) => {
  const roomId = searchParams?.get('roomId')

  const [name, setName] = useState<string>("");
  const { handleJoinRoom } = useUser();

  const handleProceed = (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    handleJoinRoom({ name, roomId: roomId! });
  };

  return (
    <div className={classes.container}>
      <section className={classes.section}>
        <img
          src="/logo.png"
          alt="Excalidraw draw Logo"
          className={classes.logo}
        />
        <h1 className={classes.heading}>
          Welcome to Excalibrate — A wrapper for Excalidraw with live video and
          chat collaboration features!
        </h1>
      </section>
      <form
        className={classes.forM}
        onSubmit={handleProceed}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className={classes.formInput}
          placeholder="Enter your name"
        />
        <button
          disabled={name?.length < 3}
          type="submit"
          className={classes.formSubmit}>
          Continue
        </button>
      </form>
    </div>
  );
};

export default WelcomeForm;
