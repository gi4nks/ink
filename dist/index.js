// src/themes.ts
var THEMES = {
  dark: { name: "Dark Classic", primary: "cyan", secondary: "magenta", accent: "blue", success: "green", warning: "yellow", error: "red", dim: "gray", bg: "#444444", fg: "white", border: "gray", selection: "cyan", info: "magenta" },
  sunset: { name: "Sunset", primary: "orange", secondary: "magenta", accent: "yellow", success: "green", warning: "red", error: "red", dim: "gray", bg: "#3d2b2b", fg: "white", border: "gray", selection: "orange", info: "magenta" },
  ocean: { name: "Deep Ocean", primary: "blue", secondary: "cyan", accent: "white", success: "green", warning: "yellow", error: "red", dim: "gray", bg: "#1a2b3c", fg: "white", border: "gray", selection: "blue", info: "cyan" },
  forest: { name: "Forest", primary: "green", secondary: "yellow", accent: "white", success: "cyan", warning: "yellow", error: "red", dim: "gray", bg: "#1b2b1b", fg: "white", border: "gray", selection: "green", info: "yellow" },
  mono: { name: "Monochrome", primary: "white", secondary: "white", accent: "gray", success: "white", warning: "white", error: "white", dim: "gray", bg: "#333333", fg: "white", border: "gray", selection: "white", info: "white" }
};
var THEME_NAMES = Object.keys(THEMES);

// src/symbols.ts
var symbols = {
  cursor: "\u276F",
  selected: "\u25CF",
  unselected: "\u25CB",
  checkmark: "\u2713",
  cross: "\u2717",
  star: "\u2605",
  starEmpty: "\u2606",
  warning: "\u26A0",
  ai: "\u2726",
  textCursor: "\u2588",
  separator: "\u2502",
  arrowUp: "\u2191",
  arrowDown: "\u2193",
  arrowLeft: "\u2190",
  arrowRight: "\u2192",
  bullet: "\u2022",
  spinner: ["\u280B", "\u2819", "\u2839", "\u2838", "\u283C", "\u2834", "\u2826", "\u2827", "\u2807", "\u280F"],
  spinnerInterval: 80
};

// src/layout.ts
var layout = {
  paddingX: 1,
  paddingY: 1,
  sectionGap: 1,
  columnGap: 2
};

// src/ai.ts
var AI_PROVIDERS = ["Gemini", "OpenAI", "Anthropic", "Ollama"];
var AI_MODELS = {
  Gemini: ["gemini-2.5-pro", "gemini-2.0-flash", "gemini-2.0-flash-exp", "gemini-1.5-pro", "gemini-1.5-flash"],
  OpenAI: ["gpt-4o", "gpt-4o-mini", "o1-preview", "o1-mini", "o3-mini"],
  Anthropic: ["claude-opus-4-6", "claude-sonnet-4-6", "claude-haiku-4-5", "claude-3-5-sonnet-latest", "claude-3-5-haiku-latest"],
  Ollama: ["llama3.1:latest", "llama3.2", "llama3.3", "qwen2.5-coder", "phi4", "deepseek-r1:8b"]
};
var AI_PROVIDER_COLORS = {
  Gemini: "blue",
  OpenAI: "green",
  Anthropic: "yellow",
  Ollama: "cyan"
};
var AI_PROVIDER_ICONS = {
  Gemini: "\u25C6",
  OpenAI: "\u25CE",
  Anthropic: "\u25C7",
  Ollama: "\u25CB"
};
var DEFAULT_AI_CONFIG = {
  provider: "Gemini",
  model: "gemini-2.0-flash",
  ollamaUrl: "http://localhost:11434"
};
async function fetchOllamaModels(ollamaUrl) {
  let url = ollamaUrl;
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "http://" + url;
  }
  const response = await fetch(`${url}/api/tags`);
  if (!response.ok) throw new Error(`Ollama error (${response.status})`);
  const data = await response.json();
  return (data.models ?? []).map((m) => m.name).filter(Boolean);
}

// src/config.ts
var DEFAULT_CONFIG = {
  theme: "dark",
  ai: {
    provider: "Gemini",
    model: "gemini-2.0-flash",
    ollamaUrl: "http://localhost:11434"
  }
};
function getConfigDir(appName) {
  const home = process.env.HOME || process.env.USERPROFILE || "";
  return `${home}/.config/gi4nks/${appName}`;
}
function getConfigPath(appName) {
  return `${getConfigDir(appName)}/config.yaml`;
}

// src/components/SectionHeader.tsx
import { Text } from "ink";
import { jsxs } from "react/jsx-runtime";
var SectionHeader = ({ title, theme, count }) => /* @__PURE__ */ jsxs(Text, { color: theme.primary, bold: true, children: [
  "\u2500\u2500 ",
  title,
  count !== void 0 ? ` (${count})` : "",
  " \u2500\u2500"
] });

// src/components/Spinner.tsx
import { useState, useEffect } from "react";
import { Text as Text2 } from "ink";
import { jsxs as jsxs2 } from "react/jsx-runtime";
var Spinner = ({ theme, label }) => {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((f) => (f + 1) % symbols.spinner.length);
    }, symbols.spinnerInterval);
    return () => clearInterval(timer);
  }, []);
  return /* @__PURE__ */ jsxs2(Text2, { color: theme.primary, children: [
    symbols.spinner[frame],
    label ? ` ${label}` : ""
  ] });
};

// src/components/KeyHint.tsx
import React2 from "react";
import { Box, Text as Text3 } from "ink";
import { jsx, jsxs as jsxs3 } from "react/jsx-runtime";
var KeyHint = ({ hints, theme, position }) => /* @__PURE__ */ jsxs3(Box, { flexDirection: "row", justifyContent: "space-between", width: "100%", paddingX: 1, children: [
  /* @__PURE__ */ jsx(Box, { children: hints.map((h, i) => /* @__PURE__ */ jsxs3(React2.Fragment, { children: [
    i > 0 && /* @__PURE__ */ jsxs3(Text3, { color: theme.dim, children: [
      " ",
      symbols.separator,
      " "
    ] }),
    /* @__PURE__ */ jsx(Text3, { color: theme.warning, bold: true, children: h.key }),
    /* @__PURE__ */ jsxs3(Text3, { color: theme.dim, children: [
      " ",
      h.description
    ] })
  ] }, h.key)) }),
  position && /* @__PURE__ */ jsx(Text3, { color: theme.primary, bold: true, children: position })
] });

// src/components/ConfigView.tsx
import { useState as useState3 } from "react";
import { Box as Box3, Text as Text5, useInput as useInput2 } from "ink";

// src/components/AIProviderSelector.tsx
import { useState as useState2, useEffect as useEffect2 } from "react";
import { Box as Box2, Text as Text4, useInput } from "ink";
import { jsx as jsx2, jsxs as jsxs4 } from "react/jsx-runtime";
var AIProviderSelector = ({
  value,
  onChange,
  onSave,
  onCancel,
  theme,
  isActive = true
}) => {
  const [activeRowIdx, setActiveRowIdx] = useState2(0);
  const [isEditing, setIsEditing] = useState2(false);
  const [draftProvider, setDraftProvider] = useState2(value.provider);
  const [draftModel, setDraftModel] = useState2(value.model);
  const [draftOllamaUrl, setDraftOllamaUrl] = useState2(value.ollamaUrl ?? "http://localhost:11434");
  const [committedOllamaUrl, setCommittedOllamaUrl] = useState2(value.ollamaUrl ?? "http://localhost:11434");
  const [draftApiKey, setDraftApiKey] = useState2(value.apiKey ?? "");
  const [ollamaModels, setOllamaModels] = useState2(AI_MODELS.Ollama);
  const [ollamaLoading, setOllamaLoading] = useState2(false);
  const rows = draftProvider === "Ollama" ? ["provider", "model", "ollamaurl", "apikey"] : ["provider", "model", "apikey"];
  const activeRow = rows[Math.min(activeRowIdx, rows.length - 1)];
  useEffect2(() => {
    if (draftProvider !== "Ollama") return;
    let cancelled = false;
    setOllamaLoading(true);
    fetchOllamaModels(committedOllamaUrl).then((names) => {
      if (cancelled) return;
      setOllamaModels(names.length > 0 ? names : AI_MODELS.Ollama);
      if (names.length > 0 && !names.includes(draftModel)) setDraftModel(names[0]);
    }).catch(() => {
    }).finally(() => {
      if (!cancelled) setOllamaLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [draftProvider, committedOllamaUrl, draftModel]);
  useInput((char, key) => {
    if (!isActive) return;
    if (isEditing) {
      if (key.return) {
        if (activeRow === "ollamaurl") setCommittedOllamaUrl(draftOllamaUrl);
        setIsEditing(false);
        onChange({ provider: draftProvider, model: draftModel, ollamaUrl: draftOllamaUrl, apiKey: draftApiKey });
      } else if (key.escape) {
        if (activeRow === "ollamaurl") setDraftOllamaUrl(committedOllamaUrl);
        setIsEditing(false);
      } else if (key.backspace || key.delete) {
        if (activeRow === "apikey") setDraftApiKey((k) => k.slice(0, -1));
        if (activeRow === "ollamaurl") setDraftOllamaUrl((u) => u.slice(0, -1));
      } else if (char && !key.ctrl && !key.meta) {
        if (activeRow === "apikey") setDraftApiKey((k) => k + char);
        if (activeRow === "ollamaurl") setDraftOllamaUrl((u) => u + char);
      }
      return;
    }
    if (key.upArrow) setActiveRowIdx((i) => Math.max(0, i - 1));
    if (key.downArrow) setActiveRowIdx((i) => Math.min(rows.length - 1, i + 1));
    if (key.rightArrow || key.leftArrow) {
      const dir = key.rightArrow ? 1 : -1;
      if (activeRow === "provider") {
        const idx = AI_PROVIDERS.indexOf(draftProvider);
        const next = AI_PROVIDERS[(idx + dir + AI_PROVIDERS.length) % AI_PROVIDERS.length];
        setDraftProvider(next);
        setActiveRowIdx((i) => Math.min(i, (next === "Ollama" ? 4 : 3) - 1));
        const nextModels = next === "Ollama" ? ollamaModels : AI_MODELS[next];
        setDraftModel(nextModels[0] ?? "");
        setDraftApiKey("");
      } else if (activeRow === "model") {
        const models = draftProvider === "Ollama" ? ollamaModels : AI_MODELS[draftProvider];
        const idx = models.indexOf(draftModel);
        setDraftModel(models[(idx + dir + models.length) % models.length]);
      }
    }
    if (key.return) {
      if (activeRow === "apikey" || activeRow === "ollamaurl") {
        setIsEditing(true);
      } else {
        onChange({ provider: draftProvider, model: draftModel, ollamaUrl: draftOllamaUrl, apiKey: draftApiKey });
        onSave();
      }
    }
    if (key.escape) onCancel();
  }, { isActive });
  const renderRow = (row, label, displayValue, isInteractive) => {
    const isSelected = activeRow === row;
    const color = isSelected ? theme.primary : theme.dim;
    return /* @__PURE__ */ jsxs4(Box2, { marginBottom: 0, children: [
      /* @__PURE__ */ jsx2(Text4, { color, children: isSelected ? `${symbols.cursor} ` : "  " }),
      /* @__PURE__ */ jsx2(Box2, { width: 16, children: /* @__PURE__ */ jsxs4(Text4, { color, bold: isSelected, children: [
        label,
        ": "
      ] }) }),
      /* @__PURE__ */ jsx2(Box2, { flexGrow: 1, children: isEditing && isSelected ? /* @__PURE__ */ jsxs4(Box2, { children: [
        /* @__PURE__ */ jsxs4(Text4, { color: theme.bg, backgroundColor: theme.secondary, children: [
          " ",
          displayValue,
          " "
        ] }),
        /* @__PURE__ */ jsx2(Text4, { color: theme.primary, children: symbols.textCursor })
      ] }) : /* @__PURE__ */ jsx2(Text4, { color: isSelected ? theme.accent : theme.dim, children: isInteractive && isSelected ? `< ${displayValue} >` : displayValue }) })
    ] }, row);
  };
  const modelDisplay = ollamaLoading && draftProvider === "Ollama" ? `${draftModel} (loading...)` : draftModel;
  const providerDisplay = `${AI_PROVIDER_ICONS[draftProvider]} ${draftProvider}`;
  return /* @__PURE__ */ jsxs4(Box2, { flexDirection: "column", children: [
    renderRow("provider", "AI Provider", providerDisplay, true),
    renderRow("model", "Model", modelDisplay, true),
    draftProvider === "Ollama" && renderRow("ollamaurl", "Ollama URL", draftOllamaUrl, false),
    renderRow(
      "apikey",
      "API Key",
      activeRow === "apikey" && isEditing ? draftApiKey : draftApiKey ? "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" : "(none)",
      false
    ),
    /* @__PURE__ */ jsx2(Box2, { marginTop: 1, children: /* @__PURE__ */ jsx2(Text4, { dimColor: true, italic: true, children: isEditing ? "Enter: Confirm \xB7 Esc: Cancel" : "\u2191\u2193 Navigate \xB7 \u2190/\u2192 Change \xB7 Enter Save/Edit \xB7 Esc Back" }) })
  ] });
};

// src/components/ConfigView.tsx
import { jsx as jsx3, jsxs as jsxs5 } from "react/jsx-runtime";
function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, part) => {
    if (acc && typeof acc === "object") return acc[part];
    return void 0;
  }, obj);
}
function setNestedValue(obj, path, value) {
  const parts = path.split(".");
  const last = parts.pop();
  const result = { ...obj };
  let target = result;
  for (const part of parts) {
    target[part] = { ...target[part] ?? {} };
    target = target[part];
  }
  target[last] = value;
  return result;
}
var ConfigView = ({
  title = "Configuration",
  fields,
  values,
  aiConfig,
  theme,
  themeName,
  isActive = true,
  onSave,
  onCancel,
  appName
}) => {
  const [cursor, setCursor] = useState3(0);
  const [editing, setEditing] = useState3(false);
  const [editValue, setEditValue] = useState3("");
  const [draftValues, setDraftValues] = useState3(values);
  const [draftTheme, setDraftTheme] = useState3(themeName);
  const [draftAI, setDraftAI] = useState3(aiConfig);
  const [showAISelector, setShowAISelector] = useState3(false);
  const [message, setMessage] = useState3("");
  const allFields = [
    ...fields,
    { label: "UI Theme", key: "__theme__", type: "string", suggestions: THEME_NAMES },
    ...aiConfig ? [{ label: "AI Settings", key: "__ai__", type: "string" }] : []
  ];
  useInput2((input, key) => {
    if (!isActive || showAISelector) return;
    if (editing) {
      const field = allFields[cursor];
      if (field.suggestions) {
        const currentIndex = field.suggestions.indexOf(editValue);
        if (key.rightArrow) {
          setEditValue(field.suggestions[(currentIndex + 1) % field.suggestions.length]);
          return;
        }
        if (key.leftArrow) {
          setEditValue(field.suggestions[(currentIndex - 1 + field.suggestions.length) % field.suggestions.length]);
          return;
        }
      }
      if (key.return) {
        if (field.key === "__theme__") {
          setDraftTheme(editValue);
        } else {
          let val = editValue;
          if (field.type === "number") val = parseInt(editValue, 10) || 0;
          setDraftValues((v) => setNestedValue(v, field.key, val));
        }
        setEditing(false);
        return;
      }
      if (key.escape) {
        setEditing(false);
        return;
      }
      if (key.backspace || key.delete) {
        setEditValue((v) => v.slice(0, -1));
        return;
      }
      if (input.length > 0 && !key.ctrl && !key.meta && !key.tab) {
        setEditValue((v) => v + input);
      }
      return;
    }
    if (input === "j" || key.downArrow) setCursor((c) => (c + 1) % allFields.length);
    else if (input === "k" || key.upArrow) setCursor((c) => (c - 1 + allFields.length) % allFields.length);
    else if (key.return || input === " ") {
      const field = allFields[cursor];
      if (field.key === "__ai__") {
        setShowAISelector(true);
      } else if (field.type === "boolean") {
        const current = getNestedValue(draftValues, field.key);
        setDraftValues((v) => setNestedValue(v, field.key, !current));
      } else {
        const currentVal = field.key === "__theme__" ? draftTheme : String(getNestedValue(draftValues, field.key) ?? "");
        setEditValue(currentVal);
        setEditing(true);
      }
    } else if (input === "s") {
      onSave(draftValues, draftAI, draftTheme);
      setMessage("Saved!");
      setTimeout(() => setMessage(""), 2e3);
    } else if (key.escape || input === "q") {
      onCancel();
    }
  }, { isActive: isActive && !showAISelector });
  if (showAISelector && draftAI) {
    return /* @__PURE__ */ jsxs5(Box3, { flexDirection: "column", paddingX: 2, paddingY: 1, children: [
      /* @__PURE__ */ jsx3(Box3, { marginBottom: 1, children: /* @__PURE__ */ jsx3(SectionHeader, { title: "AI Settings", theme }) }),
      /* @__PURE__ */ jsx3(
        AIProviderSelector,
        {
          value: draftAI,
          onChange: setDraftAI,
          onSave: () => setShowAISelector(false),
          onCancel: () => setShowAISelector(false),
          theme,
          isActive: showAISelector
        }
      )
    ] });
  }
  const renderFieldValue = (field, idx) => {
    const isSelected = cursor === idx;
    if (field.key === "__theme__") {
      const t = THEMES[draftTheme];
      return editing && isSelected ? /* @__PURE__ */ jsxs5(Text5, { color: theme.primary, children: [
        "[",
        editValue,
        "]"
      ] }) : /* @__PURE__ */ jsx3(Text5, { color: theme.primary, children: t?.name ?? draftTheme });
    }
    if (field.key === "__ai__") {
      return /* @__PURE__ */ jsx3(Text5, { color: theme.accent, children: draftAI ? `${draftAI.provider} / ${draftAI.model}` : "(not configured)" });
    }
    const val = getNestedValue(draftValues, field.key);
    if (field.type === "boolean") {
      return /* @__PURE__ */ jsx3(Text5, { color: val ? theme.success : theme.error, children: val ? `${symbols.selected} Enabled` : `${symbols.unselected} Disabled` });
    }
    const str = String(val ?? "");
    const isPassword = field.type === "password";
    if (editing && isSelected) {
      return /* @__PURE__ */ jsxs5(Box3, { children: [
        /* @__PURE__ */ jsxs5(Text5, { color: theme.bg, backgroundColor: theme.secondary, children: [
          " ",
          isPassword ? "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" : editValue,
          " "
        ] }),
        /* @__PURE__ */ jsx3(Text5, { color: theme.primary, children: symbols.textCursor })
      ] });
    }
    return /* @__PURE__ */ jsx3(Text5, { color: theme.warning, children: isPassword && str ? "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" : str || "(empty)" });
  };
  return /* @__PURE__ */ jsxs5(Box3, { flexDirection: "column", paddingX: 2, paddingY: 1, flexGrow: 1, children: [
    /* @__PURE__ */ jsxs5(Box3, { marginBottom: 1, justifyContent: "space-between", children: [
      /* @__PURE__ */ jsxs5(Text5, { bold: true, color: theme.primary, children: [
        "\u2699 ",
        appName ? `${appName} \u2014 ` : "",
        title
      ] }),
      /* @__PURE__ */ jsx3(Text5, { color: theme.success, children: message })
    ] }),
    allFields.map((f, i) => /* @__PURE__ */ jsxs5(Box3, { flexDirection: "column", marginBottom: 0, children: [
      /* @__PURE__ */ jsxs5(Box3, { children: [
        /* @__PURE__ */ jsx3(Text5, { color: theme.primary, children: i === cursor ? `${symbols.cursor} ` : "  " }),
        /* @__PURE__ */ jsx3(Box3, { width: 30, children: /* @__PURE__ */ jsx3(Text5, { bold: i === cursor, color: i === cursor ? "white" : theme.dim, children: f.label }) }),
        /* @__PURE__ */ jsx3(Box3, { flexGrow: 1, children: renderFieldValue(f, i) })
      ] }),
      editing && i === cursor && f.suggestions && /* @__PURE__ */ jsxs5(Box3, { marginLeft: 34, children: [
        /* @__PURE__ */ jsx3(Text5, { dimColor: true, children: "\u2190/\u2192 cycle: " }),
        f.suggestions.map((s) => /* @__PURE__ */ jsxs5(Text5, { color: s === editValue ? theme.primary : theme.dim, bold: s === editValue, children: [
          s === editValue ? `[${s}]` : s,
          " "
        ] }, s))
      ] })
    ] }, f.key)),
    /* @__PURE__ */ jsx3(Box3, { marginTop: 1, borderStyle: "single", borderColor: theme.dim, paddingX: 1, children: /* @__PURE__ */ jsx3(Text5, { dimColor: true, children: editing ? "Enter: Save \xB7 Esc: Cancel" : `j/k: Navigate \xB7 Enter/Space: Edit/Toggle \xB7 s: Save \xB7 Esc/q: Back` }) })
  ] });
};

// src/components/AppHeader.tsx
import { Box as Box4, Text as Text6 } from "ink";
import { Fragment, jsx as jsx4, jsxs as jsxs6 } from "react/jsx-runtime";
var AppHeader = ({
  appName,
  version,
  theme,
  cwd,
  leftExtra,
  rightContent,
  subLines,
  message
}) => /* @__PURE__ */ jsxs6(Box4, { flexDirection: "column", width: "100%", backgroundColor: theme.bg, children: [
  /* @__PURE__ */ jsxs6(
    Box4,
    {
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
      paddingX: layout.paddingX,
      children: [
        /* @__PURE__ */ jsxs6(Box4, { children: [
          /* @__PURE__ */ jsx4(Text6, { color: theme.primary, bold: true, children: appName }),
          /* @__PURE__ */ jsxs6(Text6, { dimColor: true, children: [
            " v",
            version
          ] }),
          cwd !== void 0 && /* @__PURE__ */ jsxs6(Fragment, { children: [
            /* @__PURE__ */ jsx4(Text6, { color: theme.dim, children: " in" }),
            /* @__PURE__ */ jsxs6(Text6, { color: theme.accent, children: [
              " ",
              cwd
            ] })
          ] }),
          leftExtra
        ] }),
        rightContent && /* @__PURE__ */ jsx4(Box4, { children: rightContent })
      ]
    }
  ),
  subLines?.map((line, i) => /* @__PURE__ */ jsx4(Box4, { width: "100%", paddingX: layout.paddingX, children: line }, i)),
  message && /* @__PURE__ */ jsx4(Box4, { paddingX: layout.paddingX, children: /* @__PURE__ */ jsx4(Text6, { color: theme.accent, children: message }) })
] });

// src/components/AppFooter.tsx
import { Box as Box5, Text as Text7, useStdout } from "ink";
import { jsx as jsx5, jsxs as jsxs7 } from "react/jsx-runtime";
function hintWidth(h) {
  return h === "|" ? 3 : h.key.length + 1 + h.description.length + 2;
}
var AppFooter = ({
  theme,
  hints,
  position,
  toast,
  topRow,
  statusContent
}) => {
  const { stdout } = useStdout();
  const available = (stdout?.columns ?? 80) - layout.paddingX * 2;
  let used = 0;
  const visible = [];
  for (const hint of hints) {
    const w = hintWidth(hint);
    if (used + w > available) break;
    visible.push(hint);
    used += w;
  }
  while (visible.length > 0 && visible[visible.length - 1] === "|") visible.pop();
  return /* @__PURE__ */ jsxs7(Box5, { flexDirection: "column", width: "100%", backgroundColor: theme.bg, children: [
    topRow && /* @__PURE__ */ jsx5(Box5, { paddingX: layout.paddingX, children: topRow }),
    /* @__PURE__ */ jsxs7(
      Box5,
      {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        paddingX: layout.paddingX,
        children: [
          /* @__PURE__ */ jsx5(Box5, { flexShrink: 1, children: /* @__PURE__ */ jsx5(Text7, { wrap: "truncate", children: visible.map(
            (hint, i) => hint === "|" ? /* @__PURE__ */ jsxs7(Text7, { dimColor: true, children: [
              " ",
              symbols.separator,
              " "
            ] }, i) : /* @__PURE__ */ jsxs7(Text7, { children: [
              /* @__PURE__ */ jsx5(Text7, { color: theme.warning, bold: true, children: hint.key }),
              /* @__PURE__ */ jsxs7(Text7, { dimColor: true, children: [
                " ",
                hint.description,
                "  "
              ] })
            ] }, i)
          ) }) }),
          /* @__PURE__ */ jsxs7(Box5, { marginLeft: 1, flexShrink: 0, flexDirection: "row", children: [
            toast && /* @__PURE__ */ jsx5(Box5, { marginRight: 2, children: /* @__PURE__ */ jsxs7(Text7, { color: theme.success, children: [
              "[",
              toast,
              "]"
            ] }) }),
            statusContent,
            position !== void 0 && /* @__PURE__ */ jsx5(Text7, { color: theme.primary, bold: position !== "0/0", dimColor: position === "0/0", children: position })
          ] })
        ]
      }
    )
  ] });
};
export {
  AIProviderSelector,
  AI_MODELS,
  AI_PROVIDERS,
  AI_PROVIDER_COLORS,
  AI_PROVIDER_ICONS,
  AppFooter,
  AppHeader,
  ConfigView,
  DEFAULT_AI_CONFIG,
  DEFAULT_CONFIG,
  KeyHint,
  SectionHeader,
  Spinner,
  THEMES,
  THEME_NAMES,
  fetchOllamaModels,
  getConfigDir,
  getConfigPath,
  layout,
  symbols
};
//# sourceMappingURL=index.js.map