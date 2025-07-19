import { useEffect, useReducer, useRef } from "react";
import "./App.css";
import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useColors } from "./queries/colors";
import type { ColorAPIResponse } from "./types/colors";
import { motion, AnimatePresence } from "framer-motion";

type State = {
  saturation: number;
  tempSaturation: number;
  lightness: number;
  tempLightness: number;
  colors: ColorAPIResponse[];
};

type Action =
  | { type: "SET_TEMP_SATURATION"; payload: number }
  | { type: "SET_SATURATION"; payload: number }
  | { type: "SET_TEMP_LIGHTNESS"; payload: number }
  | { type: "SET_LIGHTNESS"; payload: number }
  | { type: "SET_COLORS"; payload: ColorAPIResponse[] };

const MotionBox = motion(Box);

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_TEMP_SATURATION":
      return { ...state, tempSaturation: action.payload };
    case "SET_SATURATION":
      return { ...state, saturation: action.payload };
    case "SET_TEMP_LIGHTNESS":
      return { ...state, tempLightness: action.payload };
    case "SET_LIGHTNESS":
      return { ...state, lightness: action.payload };
    case "SET_COLORS":
      return { ...state, colors: action.payload };
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, {
    saturation: 100,
    tempSaturation: 100,
    lightness: 50,
    tempLightness: 50,
    colors: [],
  });
  const colorCache = useRef<Map<string, ColorAPIResponse[]>>(new Map());

  const colorsMutation = useColors({
    onSuccess: (data) => {
      console.log("Fetched colors:", data);
      dispatch({ type: "SET_COLORS", payload: data });
    },
    onError: (error) => {
      console.error("Error fetching colors:", error);
    },
  });

  useEffect(() => {
    const key = `${state.saturation}-${state.lightness}`;
    if (colorCache.current.has(key)) {
      dispatch({ type: "SET_COLORS", payload: colorCache.current.get(key)! });
      return;
    }
    colorsMutation.mutate(
      { saturation: state.saturation, lightness: state.lightness },
      {
        onSuccess: (data) => {
          colorCache.current.set(key, data);
          dispatch({ type: "SET_COLORS", payload: data });
        },
        onError: (error) => {
          console.error("Error fetching colors:", error);
        },
      }
    );
  }, [state.saturation, state.lightness]);

  return (
    <MotionBox
      layout
      initial={false}
      transition={{ layout: { duration: 0.5, ease: "easeInOut" } }}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        minHeight: "45rem",
        p: 4,
      }}
    >
      <MotionBox layout sx={{ mb: 1 }}>
        <Typography variant="h4">Akkio Color Palette Generator</Typography>
      </MotionBox>
      <MotionBox layout sx={{ mb: 2, mt: 1 }}>
        <Typography color="#888">
          Saturation - {state.tempSaturation}
        </Typography>
        <Stack direction="row" alignItems="center">
          <RemoveIcon />
          <Slider
            sx={{ width: 300, mx: 1 }}
            aria-label="Saturation"
            value={state.tempSaturation}
            onChange={(e, val) =>
              dispatch({ type: "SET_TEMP_SATURATION", payload: val as number })
            }
            onChangeCommitted={(e, val) =>
              dispatch({ type: "SET_SATURATION", payload: val as number })
            }
          />
          <AddIcon />
        </Stack>
      </MotionBox>

      <MotionBox layout sx={{ mb: 2 }}>
        <Typography color="#888">Lightness - {state.tempLightness}</Typography>
        <Stack direction="row" alignItems="center">
          <RemoveIcon />
          <Slider
            sx={{ width: 300, mx: 1 }}
            aria-label="Lightness"
            value={state.tempLightness}
            onChange={(e, val) =>
              dispatch({ type: "SET_TEMP_LIGHTNESS", payload: val as number })
            }
            onChangeCommitted={(e, val) =>
              dispatch({ type: "SET_LIGHTNESS", payload: val as number })
            }
          />
          <AddIcon />
        </Stack>
      </MotionBox>

      <MotionBox layout sx={{ height: 4, mb: 2, width: 300 }}>
        {colorsMutation.isPending ? <LinearProgress color="inherit" /> : null}
      </MotionBox>

      <AnimatePresence mode="wait">
        {!colorsMutation.isPending && state.colors.length > 0 && (
          <MotionBox
            key="grid"
            layout
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.4 }}
            style={{ width: "100%" }}
          >
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              {state.colors.map((color) => (
                <Grid size={1.2} key={color.hex.value}>
                  <MotionBox
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    sx={{
                      backgroundColor: color.hex.value,
                      color: "#000",
                      borderRadius: 2,
                      p: 1,
                      height: "4rem",
                    }}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography fontWeight="bold" variant="body2">
                      {color.name.value}
                    </Typography>
                    <Typography variant="caption">{color.rgb.value}</Typography>
                  </MotionBox>
                </Grid>
              ))}
            </Grid>
          </MotionBox>
        )}
      </AnimatePresence>
    </MotionBox>
  );
}

export default App;
