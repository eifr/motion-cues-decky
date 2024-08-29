import {
  ButtonItem,
  PanelSection,
  PanelSectionRow,
  Navigation,
  staticClasses,
} from "@decky/ui";
import {
  addEventListener,
  removeEventListener,
  callable,
  definePlugin,
  toaster,
  routerHook,
} from "@decky/api";
// import { call, callable } from "@decky/backend";
import { useEffect, useState } from "react";
import { FaShip } from "react-icons/fa";

// import logo from "../assets/logo.png";

// interface AddMethodArgs {
//   left: number;
//   right: number;
// }
const add = callable<[first: number, second: number], number>("add");
const startTimer = callable<[], void>("start_timer");
function Content() {
  const [result, setResult] = useState<number | undefined>();

  const onClick = async () => {
    const result = await add(Math.random(), Math.random());
    setResult(result);
  };

  return (
    <PanelSection title="Panel Section">
      <PanelSectionRow>
        <ButtonItem layout="below" onClick={onClick}>
          {result || "Add two numbers via Python"}
        </ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem layout="below" onClick={() => startTimer()}>
          {"Start Python timer"}
        </ButtonItem>
      </PanelSectionRow>

      {/* <PanelSectionRow>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src={logo} />
        </div>
      </PanelSectionRow> */}

      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={() => {
            Navigation.Navigate("/decky-plugin-test");
            Navigation.CloseSideMenus();
          }}
        >
          Router
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
}

const GlobalComponent = () => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [z, setZ] = useState(0);
  useEffect(() => {
    const registration =
      window.SteamClient.Input.RegisterForControllerStateChanges(
        (changes: any[]) => {
          for (const inputs of changes) {
            console.log(
              "controller state flGravityVectorX:",
              inputs["flGravityVectorX"]
            );

            // logic
            setX(inputs["flGravityVectorX"]);
            setY(inputs["flGravityVectorY"]);
            setZ(inputs["flGravityVectorZ"]);
          }
        }
      );

    return () => {
      console.log("unregister controller state changes");
      registration.unregister();
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        top: "0",
        left: "0",
        transform: `translateX(${100*x}px) translateY(${100*y}px) translateZ(${100*z}px)`,
        transition: "transform 0.1s linear",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          backgroundColor: "red",
          borderRadius: "10px",
          padding: "10px",
        }}
      >
        Global component 2
      </div>
    </div>
  );
};

export default definePlugin(() => {
  // serverApi.routerHook.addRoute("/decky-plugin-test", DeckyPluginRouterTest, {
  //   exact: true,
  // });
  // console.log("init plugin", call, callable)

  routerHook.addGlobalComponent("BrightnessBar", GlobalComponent);

  const listener = addEventListener<
    [test1: string, test2: boolean, test3: number]
  >("test_event", (test1, test2, test3) => {
    console.log("Template got event", test1, test2, test3);
    toaster.toast({
      title: "template got event",
      body: `${test1}, ${test2}, ${test3}`,
    });
  });

  return {
    title: <div className={staticClasses.Title}>API v2 Example Plugin</div>,
    content: <Content />,
    icon: <FaShip />,
    onDismount() {
      console.log("Unloading");
      removeEventListener("test_event", listener);
      routerHook.removeGlobalComponent("BrightnessBar");

      // serverApi.routerHook.removeRoute("/decky-plugin-test");
    },
  };
});
