"use client";
import React from "react";
import ActionToolbar from "./ActionToolbar";

const FloatingButtons = () => {
  return (
    <ActionToolbar>
      <ActionToolbar.Layout>
        <ActionToolbar.PlusButton className="w-full" />
        <ActionToolbar.CameraButton />
        <ActionToolbar.FolderButton />
      </ActionToolbar.Layout>
    </ActionToolbar>
  );
};

export default FloatingButtons;
