import React, { useContext } from "react";
import MachineStateContext from "../context/machineStateContext";
import ScanLogin from "./loginComponents/scanLogin";
import TypeLogin from "./loginComponents/typeLogin";
import UniLogin from "./loginComponents/uniLogin";
import "../../scss/login.scss";

function Login() {
  const context = useContext(MachineStateContext);

  function renderStep(loginConfig) {
    switch (loginConfig) {
      case "scan":
        return <ScanLogin></ScanLogin>;
      case "type":
        return <TypeLogin></TypeLogin>;
      case "uni":
        return <UniLogin></UniLogin>;
      default:
        return <span>Loginmetode er ikke konfigureret</span>;
    }
  }

  return <>{renderStep(context.loginConfig.get)}</>;
}

export default Login;
