# Dynamic Epistemic Decay (DED) Chatbot Demo

A lightweight, single-file interactive chatbot demonstrating the **Dynamic Epistemic Decay (DED)** framework introduced in _Dynamic Epistemic Decay: A Multi-Dimensional Framework for Knowledge Currency in Retrieval-Augmented Generation_ (Alan Kochukalam George, 2026).

This project implements a practical demonstration of **Temporal Decay ($\lambda_t$)** mapped to conversational turns, treating knowledge currency as a dynamic property rather than a static fixture of the LLM's context window.

## 📖 Conceptual Background

Large Language Models (LLMs) traditionally treat all knowledge in their context window as uniformly persistent. The DED Framework proposes that different types of knowledge expire at fundamentally different rates.

Instead of arbitrarily dumping conversation history when the context window fills up, this chatbot extracts factual claims from the conversation, categorizes them, and applies mathematical decay rates exactly as specified in the paper:

| Knowledge Category         | Decay Rate ($\lambda_t$) | Rationale                            |
| :------------------------- | :----------------------- | :----------------------------------- |
| `MATHEMATICAL_TRUTH`       | 0.0                      | Logical necessity; cannot expire     |
| `HISTORICAL_SEAL`          | 0.0                      | Causal closure; past is fixed        |
| `PHYSICAL_LAW`             | ~0.0001                  | Highly stable; paradigm changes rare |
| `GEOGRAPHIC_FACT`          | ~0.0002                  | Stable; occasional border changes    |
| `INSTITUTIONAL_LEADERSHIP` | ~0.002                   | Changes on years timescale           |
| `CURRENT_EVENT`            | ~0.05                    | Changes on weeks timescale           |
| `BREAKING_NEWS`            | 0.8+                     | Changes on hours timescale           |

_Note: In this interactive chat demo, time ($\Delta t$) is substituted with "conversational turns" to make the decay mathematically visible in real-time._

## ✨ Features

- **Real-Time Fact Extraction**: Uses a fast LLM call (via Groq API using `meta-llama/llama-4-scout-17b-16e-instruct`) to extract structural facts `[Subject, Value]` from user inputs. (A regex-based fallback exists but an API key is required for full functionality).
- **Dynamic Context Injection**: The chat agent (powered by `llama-3.1-8b-instant`) is explicitly instructed to rely _only_ on "LIVE FACTS" currently surviving in the epistemic state, and strictly ignore "DEAD" facts that have decayed past the viability threshold.
- **Visual Fact Tracker**: A specialized side-panel (`fpanel`) visualizing:
  - Extracted facts and their inferred categories.
  - Current confidence percentage ($C(t) = C_0 \times e^{(-\lambda_t \times \Delta t)}$).
  - A visual depletion bar showing the fact's decay over turns.
- **Zero-Dependency**: The entirety of the application—styles, logic, and interface—is contained in a single `ded_chatbot_v2.html` file.

## 🚀 How to Run

1. Clone or download this repository.
2. Open `ded_chatbot_v2.html` in any modern web browser.
3. **Required**: To enable chatting with an LLM and enhanced fact extraction, enter a valid [Groq API Key](https://console.groq.com/keys) in the top header.
   - **Chat Model**: `llama-3.1-8b-instant`
   - **Extraction Model**: `meta-llama/llama-4-scout-17b-16e-instruct`
4. Start chatting! Try introducing different types of facts:
   - _"The current score of the game is 2-1"_ (Will decay rapidly as an event/news)
   - _"Pi is equal to 3.14159"_ (Will persist infinitely as mathematical truth)

## 🧠 Architecture Overview

### Extraction & Classification

When the user sends a message, an asynchronous pre-processing step reads the text and extracts explicit claims. These claims undergo semantic keyword checks to categorize them (e.g., detecting keywords like `gravity`, `president`, `stock market`, or `pi`) to assign the appropriate epistemic category.

### Decay Implementation

At each turn, the system iterates over the `facts` array and calculates semantic confidence:
`C = dc(initial_confidence, elapsed_turns, category)`
If `C` drops below the `DEAD` threshold (default `0.12`), it moves from the active context to the dead pool.

### LLM System Prompt Overriding

To ensure the LLM obeys the epistemic rules, the raw conversational history is structurally limited. Instead, the system injects a heavily weighted prompt:

```text
LIVE FACTS (use these as your ONLY source of truth...):
• [100% conf] "Pi" = "3.14159"
• [34% conf] "Current weather" = "raining"

CRITICAL: The following facts have DECAYED and are now DEAD...
• [DEAD] "Stock price" = "up 5%"
```

## 📝 Citation

Based on the mechanism designs from:
**George, A. K. (2026).** _Dynamic Epistemic Decay: A Multi-Dimensional Framework for Knowledge Currency in Retrieval-Augmented Generation._
