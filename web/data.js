// ---------------------------------------------------------------------------
// SPOTYKACH MANUAL — CONTENT
// ---------------------------------------------------------------------------
// Real content, sourced from the Spotykach Notion manual export.
//
// Shape:
//  - MODES: the three deck modes (facet #1).
//  - CONTROLS: the deck controls whose behavior differs per mode (facet #2).
//    Every CONTROLS x MODES pair should have a matching entry in TOPICS,
//    with id `${control.id}_${mode.id}`.
//  - CONCEPTS: cross-cutting ideas referenced from many topics/pages.
//  - PAGES: long-form, non-mode-specific sections (their `body` is trusted
//    HTML, unlike topic/concept `body` which is plain text).
//  - TOPICS: one atomic (control, mode) behavior per entry.
//
// Wrapped in an IIFE so these declarations stay function-scoped: data.js and
// app.js are both classic (non-module) scripts sharing one global lexical
// scope, and app.js destructures its own top-level `const MODES` etc. from
// window.SPOTYKACH_DATA — without this wrapper the two `const MODES`
// declarations collide and throw at load time.
//
// ---------------------------------------------------------------------------
(function () {

const MODES = [
  {
    id: "reel",
    label: "Reel",
    color: "#c98a2e",
    blurb: "Tape-style mono looping inspired by 1940s–60s tape music — speed and pitch are locked together."
  },
  {
    id: "slice",
    label: "Slice",
    color: "#3d6fe0",
    blurb: "Clock-driven sampler/looper inspired by 1980s digital sampling — pitch is independent of speed, up to 3 voices."
  },
  {
    id: "drift",
    label: "Drift",
    color: "#8a5fd0",
    blurb: "Granular generator — overlapping grains stretch tiny fragments of sound into an evolving texture."
  }
];

const CONTROLS = [
  { id: "pitch",    label: "Pitch / Speed",  order: 1 },
  { id: "position", label: "Position",       order: 2 },
  { id: "size",     label: "Size",           order: 3 },
  { id: "envelope", label: "Envelope",       order: 4 },
  { id: "mix",      label: "Mix",            order: 5 },
  { id: "trig",     label: "Trig",           order: 6 },
  { id: "record",   label: "Record / Arm",   order: 7 }
];

const CONCEPTS = [
  {
    id: "visual-catchup",
    title: "Visual catch-up (knob hijacking)",
    body: "Also called knob hijacking, passthrough takeover, or parameter grabbing. Most knobs control more than one function depending on mode or alt-state, so a knob's physical position often doesn't match the parameter's current stored value. Spotykach shows the mismatch as a red segment on the knob's LED ring. The parameter won't move until you turn the knob to the position where the red segment disappears — at that point the knob is back in sync, and further changes are smooth with no jump in sound."
  },
  {
    id: "alt-function",
    title: "Alt — secondary functions",
    body: "Holding `alt` while touching a knob or pad temporarily switches it to a secondary function, letting one physical control carry two roles. Examples: alt while turning Pitch/Speed sets quantized intervals in every mode (-2oct, -1oct, -fifth, 0, +fifth, +1oct, +2oct); alt+Size sets Drift's grain size, or toggles Slice between mono and poly; alt+Envelope sets Drift's envelope length; alt+Mix sets overdub feedback; alt+Play arms recording or engages overdubbing; alt+Reverse starts deck-to-deck recording; alt+Grit or alt+Flux toggles that effect's latch. See Visual catch-up for how the panel shows you when a secondary value doesn't yet match the knob's physical position."
  },
  {
    id: "key-beat",
    title: "Key Beat & launch quantization",
    body: "The Key Beat is the quarter note where quantized playback and recording actually trigger. It governs Slice mode, and any mode with an active trigger sequence. Hold `tap` and turn `mix a` to set the interval between Key Beats, shown on Deck A's LED ring: one white dot means every quarter note is a Key Beat (default); a white dot plus colored dots means a Key Beat every few beats (1 white + 3 colored = once per 4/4 bar); knob fully counter-clockwise is Subdivision mode, which disables the Key Beat and snaps actions to the nearest 1/16th note instead. The Clock LED mirrors the setting live: white flashes on the Key Beat with clock-colored flashes on intermediate beats, or clock-colored-only flashes in Subdivision mode."
  },
  {
    id: "polyphony",
    title: "Polyphony in Slice mode",
    body: "Slice mode is polyphonic by default, with 3 voices per deck and voice stealing once all three are in use. Toggle between mono and poly with `alt+size` turned fully counter-clockwise (mono) or fully clockwise (poly, default). A deck can also be forced permanently mono via config.txt (`slc_mn_a` / `slc_mn_b`)."
  },
  {
    id: "overdubbing",
    title: "Overdubbing",
    body: "If a deck is already playing, tap `alt+play` to layer new material on top of what's already recorded — the deck starts behaving like a delay effect. `alt+mix` controls feedback: how much of the existing loop decays with each pass. While overdubbing, the recording head and playhead decouple. The recording head stays fixed to the loop length set when you first recorded, unaffected by Position, Size or Speed. The playhead stays fully interactive — changes made with the knobs are audible live but non-destructive, and won't be saved into the loop. To use Spotykach like a plain looper pedal: set Pitch/Speed to 1x (center), Position and Envelope to zero, and Size to maximum. When synced to an external MIDI clock, Slice-mode overdubbing may glitch — for best results, make Spotykach the master clock."
  },
  {
    id: "resampling",
    title: "Deck-to-deck recording (resampling)",
    body: "Tap `alt+reverse` to record — or overdub, if that deck is already playing — the output of the other deck into this one, useful for layering one deck's processed sound into the other. Start/stop follows the same rules as recording from an external input: threshold-triggered in Reel and Drift, quantized to the Key Beat in Slice. You can cross-record Deck A into B and Deck B into A at the same time."
  },
  {
    id: "generative-panning",
    title: "Generative stereo panning",
    body: "When the routing switch is turned all the way right (Generative Stereo mode), Spotykach adds automatic panning to each deck's output, shaped differently per mode. Reel: the output glides continuously between left and right; the speed and amount ranges are set with `tap+cycle b` (speed) and `tap+glow b` (amount). Slice: the pan jumps between left and right at a changing interval and amount, set with the same `tap+cycle b` / `tap+glow b` combination. Drift: every grain gets an independently randomized pan, widening the overall texture."
  },
  {
    id: "external-clock",
    title: "External clock source",
    body: "Spotykach can run on its internal clock or sync to an external one. Tap `alt+tap` repeatedly to cycle the clock source; the Clock LED shows which is active — green for internal, pink for TRS (expects 4PPQN), turquoise for MIDI (expects 24PPQN). While an external clock is engaged, the internal clock acts as a multiplier, so the sequencer and Slice mode only run for as long as the external signal keeps arriving. If internal and external beats drift apart, hold `tap` and tap `Trig A` to reset: doing this while the external clock is stopped aligns future beats to it; doing it while the external clock is running snaps the internal beat to that exact moment."
  }
];

// ---------------------------------------------------------------------------
// PAGES — long-form sections, not tied to a single (control, mode) pair.
// `body` is trusted HTML (authored here, not user input).
// ---------------------------------------------------------------------------
const PAGES = [
  {
    id: "overview",
    section: "Getting started",
    title: "Instrument overview",
    dek: "What's on the back panel, and what the ins and outs actually carry.",
    body: `
      <figure class="page-figure">
        <img src="images/instrument-overview.jpg" alt="Spotykach unit, top-down view showing both decks, knobs and pad rings" loading="lazy" />
      </figure>

      <h3>Back of the unit</h3>
      <p><strong>USB‑C</strong> — used for both power (5V 1A) and firmware updates. Use the cable that came with the unit. It's safe to power the device through USB‑C and the 15V DC barrel jack at the same time; see <a href="#/page/powering">Powering the unit</a> for details and a note about ground-loop noise.</p>
      <p><strong>Reset button</strong> — a short press reboots the device. A long press activates firmware update mode.</p>
      <p><strong>Barrel jack power</strong> — accepts 15V 1A, center positive, 5.5mm outside / 2.5mm inside barrel diameter.</p>

      <h3>Headphones out</h3>
      <p>An additional stereo output mirroring the top audio outputs.</p>
      <div class="callout callout-warning">This output is designed for stereo TRS cables only, not TS mono cables.</div>

      <h3>MIDI In / Out</h3>
      <p>Accepts Type A MIDI cables. See <a href="#/page/midi">MIDI</a> for sync, channels and the implementation chart.</p>

      <h3>Audio inputs</h3>
      <p>Two mono inputs, routable in various ways — see <a href="#/page/mixing-routing">Mixing and routing</a>. They accept signals up to slightly above 10Vpp (‑5V to +5V) when gain is set toward the lower end. Inputs are shunt-protected: if a signal exceeds the expected range, or gain is set too high, the circuit clips safely rather than being damaged. That clipping isn't sonically tuned and can sound harsh — it just won't hurt the hardware.</p>

      <h3>Audio outputs</h3>
      <p>Two mono outputs, behaving differently depending on the routing switch (see <a href="#/page/mixing-routing">Mixing and routing</a>). The trim pot under each output jack attenuates or amplifies that output. Outputs can generate signals slightly above 10Vpp (‑5V to +5V) with gain turned up fully.</p>
      <div class="callout callout-tip">Feed Spotykach with line level, and use the output trim pots to bring it up to Eurorack level.</div>

      <h3>CV and gate inputs</h3>
      <p>Fully compatible with standard Eurorack voltage ranges, and designed to tolerate slightly beyond that range without damage.</p>

      <h3>CV and gate outputs</h3>
      <p>Produce voltages from 0 to +5V.</p>
    `
  },
  {
    id: "powering",
    section: "Getting started",
    title: "Powering the unit",
    dek: "Two power options, and how to avoid the ground-loop whine.",
    body: `
      <ol>
        <li><strong>USB‑C → 5V 1A.</strong> Very portable — runs fine on power banks, or even plugged into a phone.</li>
        <li><strong>15V power supply → 15V 1A, center positive.</strong> Barrel diameter is 5.5mm outside, 2.5mm inside.</li>
      </ol>
      <div class="callout callout-note">It's safe to power the unit through 15V DC and USB at the same time.</div>
      <div class="callout callout-note">If you power the device from your computer's USB port, you may hear a high-pitched whining noise caused by a ground loop. To eliminate it, use a separate USB power supply — any non-computer USB adapter works.</div>
      <p>There's no physical on/off switch — a hardware switch would require a full PCB redesign, so it's currently ruled out. Some users add a power cable with a built-in switch instead.</p>
    `
  },
  {
    id: "deck-modes",
    section: "Getting started",
    title: "Deck modes",
    dek: "Reel, Slice and Drift — the same five knobs, three different instruments.",
    body: `
      <p>Every deck can switch between three core behaviors. The same physical controls — <a href="#/control/pitch">Pitch/Speed</a>, <a href="#/control/position">Position</a>, <a href="#/control/size">Size</a>, <a href="#/control/envelope">Envelope</a>, <a href="#/control/mix">Mix</a>, <a href="#/control/trig">Trig</a>, <a href="#/control/record">Record</a> — mean something different in each.</p>
      <ul>
        <li><a href="#/mode/reel">Reel mode</a> (yellow/amber) — inspired by 1940s–60s tape music. Monophonic; speed and pitch are bound together, so playing faster raises the pitch.</li>
        <li><a href="#/mode/slice">Slice mode</a> (blue) — a mono/polyphonic sampler/looper inspired by 1980s digital sampling. Playback and recording are clock-driven, and pitch is independent of speed, allowing time-stretching and pitch-shifting. Polyphonic by default with 3 voices per deck; switchable to mono with <code>alt+size</code>.</li>
        <li><a href="#/mode/drift">Drift mode</a> (purple) — a granular generator inspired by modern software granulators, where many grains fire together, stretching tiny movements of sound into an ever-changing texture.</li>
      </ul>
      <p>For a full walkthrough of all three modes, see the Bay Mud video tutorial: <a href="https://www.youtube.com/watch?v=PZ0J4z2n4wI" target="_blank" rel="noopener">youtube.com/watch?v=PZ0J4z2n4wI</a>.</p>
    `
  },
  {
    id: "mixing-routing",
    section: "Sound & routing",
    title: "Mixing and routing",
    dek: "How the two inputs and two decks combine, and what the routing switch changes.",
    body: `
      <p>Routing depends on the position of the routing switch and on which inputs are connected.</p>
      <div class="callout callout-tip">Input <code>a</code> is wired so that if a cable is plugged only into it, its signal is mirrored to input <code>b</code> internally — so both decks get the same signal.</div>

      <h3>Input routing — mono mode</h3>
      <figure class="page-figure">
        <img src="images/routing-input-mono-a.png" alt="Diagram: only input a connected, mirrored internally to input b" loading="lazy" />
        <figcaption>Only <code>a</code> connected — its signal is mirrored to <code>b</code> internally, so both decks get the same signal.</figcaption>
      </figure>
      <figure class="page-figure">
        <img src="images/routing-input-mono-b.png" alt="Diagram: only input b connected, only deck B receives signal" loading="lazy" />
        <figcaption>Only <code>b</code> connected — only deck B gets the input signal.</figcaption>
      </figure>
      <figure class="page-figure">
        <img src="images/routing-input-mono-ab.png" alt="Diagram: both inputs connected, each deck gets its same-named input" loading="lazy" />
        <figcaption>Both <code>a</code> and <code>b</code> connected — each deck gets the signal from the same-named input.</figcaption>
      </figure>

      <h3>Input routing — stereo and generative mode</h3>
      <figure class="page-figure">
        <img src="images/routing-input-stereo-a.png" alt="Diagram: only input a connected, mirrored to b, both decks get left and right channel of same source" loading="lazy" />
        <figcaption>Only <code>a</code> connected — it's mirrored to <code>b</code> internally, so both decks get the same signal as the left and right channel.</figcaption>
      </figure>
      <figure class="page-figure">
        <img src="images/routing-input-stereo-b.png" alt="Diagram: only input b connected, both decks get only the right channel" loading="lazy" />
        <figcaption>Only <code>b</code> connected — both decks get only the right channel.</figcaption>
      </figure>
      <figure class="page-figure">
        <img src="images/routing-input-stereo-ab.png" alt="Diagram: both inputs connected, a provides left channel, b provides right channel" loading="lazy" />
        <figcaption>Both connected — <code>a</code> provides the left channel, <code>b</code> provides the right.</figcaption>
      </figure>

      <h3>Output routing — mono mode</h3>
      <figure class="page-figure">
        <img src="images/routing-output-mono.png" alt="Diagram: deck a and b output to same-named outputs, no mixing" loading="lazy" />
        <figcaption>Both decks output to their same-named output. The a/b fader is still engaged, but only as an output volume control — no mixing happens.</figcaption>
      </figure>

      <h3>Output routing — stereo and generative mode</h3>
      <figure class="page-figure">
        <img src="images/routing-output-stereo.png" alt="Diagram: outputs of both decks mixed, left channel to out a, right channel to out b" loading="lazy" />
        <figcaption>Both decks' outputs are mixed. The left channel goes to out <code>a</code>, the right to out <code>b</code>. The decks' mix is set by the a/b fader and a dedicated CV input.</figcaption>
      </figure>

      <h3>Generative stereo mode</h3>
      <p>With the routing switch all the way right, Spotykach adds automatic panning on top of the stereo output — see <a href="#/concept/generative-panning">Generative stereo panning</a> for how that differs by deck mode.</p>
    `
  },
  {
    id: "modulation",
    section: "Playing & modulating",
    title: "Modulation sources and inputs",
    dek: "Two internal modulation sources, each switchable between two LFO shapes and an envelope follower.",
    body: `
      <p>Spotykach has two internal modulation sources, A and B, patchable via the output jacks. Each source has three modes: two LFO waveforms plus an envelope follower.</p>

      <h3>LFOs</h3>
      <p>Each source offers two LFO waveforms, selectable with a switch: source A is S&amp;H or Square; source B is Sine or Sawtooth.</p>
      <ul>
        <li>The <code>cycle</code> knob sets LFO frequency. Hold <code>alt</code> while turning it for clock-synced rates: 1/32, 1/16, 1/8, 1/4, 1/2, 1, 2, 3 or 4 bars.</li>
        <li>The <code>glow</code> knob attenuates the LFO's depth.</li>
      </ul>

      <h3>Envelope follower</h3>
      <p>Each envelope follower (A or B) listens to the output of its same-named deck; while active, the modulation LED matches that deck mode's color. The signal is tapped after the deck's <code>mix</code> knob, so both input and playback are included — meaning it can follow an external signal directly when <code>mix</code> is fully counter-clockwise.</p>
      <p>In follower mode, <code>cycle</code> controls attack and release, and <code>glow</code>'s range lets you compensate for quiet sources.</p>
      <div class="callout callout-warning">Because the follower's output depends on the input signal's volume, switching between follower and LFO modes can cause a sudden jump in modulation amount.</div>

      <h3>CV inputs</h3>
      <ul>
        <li><strong>position / size</strong> — controls loop start position, loop size, or both, depending on the dedicated switch. In Slice mode it's applied once a new pass triggers; in Reel and Drift it's applied continuously.</li>
        <li><strong>gate in</strong> — triggers a one-shot pass, like the <code>trig</code> pad.</li>
        <li><strong>mix</strong> — controls the input/playback balance of the deck.</li>
        <li><strong>v/oct</strong> — controls pitch/speed. In Slice mode it's applied once a new pass triggers; in Reel and Drift, continuously. When played over MIDI, it's added to the note's pitch.</li>
        <li><strong>a / b fader input</strong> — controls the decks' mix.</li>
      </ul>
    `
  },
  {
    id: "effects",
    section: "Playing & modulating",
    title: "Effects",
    dek: "Grit (texture) and Flux (time) — held, not switched in.",
    body: `
      <p>Spotykach carries several effects on the <code>grit</code> and <code>flux</code> pads. They affect both the live input signal and the recorded audio, so Spotykach can work as a real-time distortion, delay or stutter effect even without recording anything.</p>

      <h3>Effect controls</h3>
      <ol>
        <li>Hold the effect pad — the signal runs through the effect for as long as it's held.</li>
        <li><code>alt</code> + the effect pad toggles that effect's latch on or off.</li>
      </ol>
      <p>To switch an effect's type, hold the effect pad and tap <code>tap</code> (the black button, top-left of the unit). Hold the effect pad and the deck's LED ring glows in that effect's color; use <code>pitch</code>, <code>mix</code> and <code>pos</code> to shape its parameters.</p>
      <div class="callout callout-tip">Hold <code>grit</code> and tap <code>tap</code> — the ring color switches from yellow to orange (yellow is Analog Saturation, orange is Bit Crusher).</div>

      <h3>Grit — texture effects</h3>
      <p><strong>Distortion (yellow)</strong> — analog saturation. Hold <code>grit</code> and turn <code>pitch</code> left for soft saturation, right for harder distortion. Hold <code>grit</code> and turn <code>mix</code> to set the effect's mix.</p>
      <p><strong>Bit crusher (orange)</strong> — digital distortion. Hold <code>grit</code> and turn <code>pitch</code> left for soft degradation, right for lower bitrates and harsher clipping. Hold <code>grit</code> and turn <code>mix</code> to set the effect's mix.</p>

      <h3>Flux — time-based effects</h3>
      <p><strong>Tape delay emulation (pink)</strong> — currently the only Flux effect. Hold <code>flux</code> and turn <code>pitch</code> to change tape speed, <code>mix</code> to change the delay's output mix, and <code>pos</code> to change delay feedback.</p>
    `
  },
  {
    id: "sequencer",
    section: "Playing & modulating",
    title: "Trigger sequencer",
    dek: "One shared step pattern per deck, working the same way across all three modes.",
    body: `
      <p>Each deck has a dedicated trigger sequencer that works across all three modes — the recorded sequence is shared between them. Resolution is 1/16th notes, and anything recorded is automatically quantized to that grid. Once a sequence is recorded, deck playback starts on the next <a href="#/concept/key-beat">Key Beat</a> in every mode.</p>

      <h3>Record a sequence</h3>
      <ol>
        <li>Locate the two <code>trig</code> pads under the modulation sources.</li>
        <li>Tap <code>alt+trig</code> to arm sequence recording — the alt LED blinks white to the clock.</li>
        <li>Recording start depends on <a href="#/concept/key-beat">launch quantization</a>: if the pre-count is one quarter note or more, recording starts on the Key Beat; if it's less than one quarter (the whole ring glows), recording starts on the first <code>trig</code> tap instead.</li>
        <li>Tap the deck's <code>trig</code> pad to the rhythm you want.</li>
        <li>Tap <code>alt</code> or <code>play</code> to stop recording.</li>
        <li>The sequence is saved, and now drives the deck's playback.</li>
      </ol>

      <h3>Delete a sequence</h3>
      <p>Hold <code>alt</code> + the sequence pad for 2 seconds. The play LED blinks quickly, and the sequence is deleted.</p>
    `
  },
  {
    id: "clock-tempo",
    section: "Playing & modulating",
    title: "Clock, tempo & metronome",
    dek: "One clock, running permanently, driving Slice mode and the sequencer.",
    body: `
      <p>Spotykach's clock drives playback and recording in Slice mode, plus the trigger sequencer. It runs permanently once the unit is powered, using its internal clock unless an <a href="#/concept/external-clock">external clock</a> is engaged.</p>
      <p>In Slice mode: playback starts on the next <a href="#/concept/key-beat">Key Beat</a>, and stops immediately once <code>play</code>/<code>reverse</code> is tapped; audio and sequencer recording start and stop on the next Key Beat. In every mode: if a sequence is recorded, playback starts on the next Key Beat.</p>

      <h3>Metronome</h3>
      <p>The clock LED (below the <code>clock in</code> jack) blinks on every quarter note — the clock beat — aligned with the metronome's click. Hold <code>tap</code> and turn <code>glow A</code> to change the metronome's volume.</p>

      <h3>Setting the tempo</h3>
      <div class="callout callout-warning">Tempo can only be set for the internal clock, and is limited to 20–250 BPM.</div>
      <ul>
        <li>Tap the tempo in on the <code>tap</code> button.</li>
        <li>Hold <code>tap</code> and turn <code>cycle A</code>.</li>
        <li>In Slice mode, once a sample is loaded: hold <code>tap</code> and turn the deck's <code>size</code> knob. The deck's ring shows a series of points — each one is a quarter note (beat) considered to fit within the loaded sample's size, with every fourth dot in white for easier counting. For a 2‑bar loop, for example, select 8 points to align the tempo to the loop's length.</li>
      </ul>
      <p>See <a href="#/concept/key-beat">Key Beat &amp; launch quantization</a> for how the tempo grid maps onto when things actually trigger, and <a href="#/concept/external-clock">External clock source</a> for syncing to TRS or MIDI clock instead.</p>
    `
  },
  {
    id: "midi",
    section: "Storage & connectivity",
    title: "MIDI",
    dek: "Clock, transport, channels, and the full CC implementation chart.",
    body: `
      <p>Spotykach sends and receives MIDI over both USB and TRS ports.</p>

      <h3>Sync</h3>
      <p>Spotykach can receive and sync to standard MIDI Clock at 24PPQN — see <a href="#/concept/external-clock">External clock source</a> for switching to it. It can also send standard 24PPQN clock out, continuously, whenever the internal clock is running or an external clock is being received.</p>
      <div class="callout callout-tip">Spotykach can be used to convert a 4PPQN Eurorack clock into a 24PPQN MIDI clock.</div>

      <h3>Start / Stop</h3>
      <p>Decks can be started/stopped by standard MIDI Start/Stop/Continue messages. Since Spotykach has no timeline, Start and Continue are treated identically. This is disabled by default — enable it per deck with flags in <a href="#/page/sdcard">config.txt</a>.</p>

      <h3>MIDI channel</h3>
      <p>Each deck has its own MIDI channel — 1 for Deck A, 2 for Deck B by default, changeable via <a href="#/page/sdcard">config.txt</a>. Both decks can also share one channel.</p>
      <div class="callout callout-tip">Spotykach calculates MIDI note pitch relative to middle C (C4, note number 60). To play in tune, make sure your sample/recording's pitch is C, or use the <code>pitch</code> knob to tune it.</div>

      <h3>MIDI implementation chart</h3>
      <div class="table-scroll">
        <table>
          <thead><tr><th>CC#</th><th>Function</th><th>Sent</th><th>Received</th><th>Remarks</th></tr></thead>
          <tbody>
            <tr><td>–</td><td>MIDI Clock</td><td>Yes</td><td>Yes</td><td>See External clock.</td></tr>
            <tr><td>–</td><td>Start</td><td>Yes</td><td>No</td><td>See config.txt to enable handling.</td></tr>
            <tr><td>–</td><td>Stop</td><td>Yes</td><td>No</td><td>See config.txt to enable handling.</td></tr>
            <tr><td>–</td><td>Note On</td><td>Yes</td><td>No</td><td>Treated as trigger signals; gate‑in LED blinks on receive.</td></tr>
            <tr><td>14</td><td>Record from input</td><td>Yes</td><td>No</td><td>Toggle, non‑zero value. Acts as alt+play.</td></tr>
            <tr><td>15</td><td>Record from other deck</td><td>Yes</td><td>No</td><td>Toggle, non‑zero value. Acts as alt+reverse.</td></tr>
            <tr><td>20</td><td>Position</td><td>Yes</td><td>No</td><td>0–127</td></tr>
            <tr><td>21</td><td>Position offset</td><td>Yes</td><td>No</td><td>0–127</td></tr>
            <tr><td>22</td><td>Size</td><td>Yes</td><td>No</td><td>0–127</td></tr>
            <tr><td>23</td><td>Envelope</td><td>Yes</td><td>No</td><td>0–127</td></tr>
            <tr><td>24</td><td>Pitch</td><td>Yes</td><td>No</td><td>0–127</td></tr>
            <tr><td>25</td><td>Deck mix</td><td>Yes</td><td>No</td><td>0–127</td></tr>
            <tr><td>26</td><td>Overdub feedback</td><td>Yes</td><td>No</td><td>0–127. Equivalent to alt+mix.</td></tr>
            <tr><td>27</td><td>Drift envelope size</td><td>Yes</td><td>No</td><td>0–127. Equivalent to alt+envelope.</td></tr>
            <tr><td>28</td><td>Drift window size</td><td>Yes</td><td>No</td><td>0–127. Equivalent to alt+size.</td></tr>
            <tr><td>85</td><td>Play forward</td><td>Yes</td><td>No</td><td>Toggle, non‑zero value. Acts as play tap.</td></tr>
            <tr><td>86</td><td>Play reverse</td><td>Yes</td><td>No</td><td>Toggle, non‑zero value. Acts as reverse tap.</td></tr>
            <tr><td>89</td><td>Modulation cycle</td><td>Yes</td><td>No</td><td>0–127</td></tr>
            <tr><td>90</td><td>Modulation glow</td><td>Yes</td><td>No</td><td>0–127</td></tr>
            <tr><td>102</td><td>Grit on</td><td>Yes</td><td>No</td><td>Momentary. 0 = off, 1–127 = on.</td></tr>
            <tr><td>103</td><td>Grit intensity</td><td>Yes</td><td>No</td><td>0–127. Equivalent to grit+pitch.</td></tr>
            <tr><td>104</td><td>Grit mix</td><td>Yes</td><td>No</td><td>0–127. Equivalent to grit+mix.</td></tr>
            <tr><td>105</td><td>Flux on</td><td>Yes</td><td>No</td><td>Momentary. 0 = off, 1–127 = on.</td></tr>
            <tr><td>106</td><td>Flux intensity</td><td>Yes</td><td>No</td><td>0–127. Equivalent to flux+pitch.</td></tr>
            <tr><td>107</td><td>Flux feedback</td><td>Yes</td><td>No</td><td>0–127. Equivalent to flux+pos.</td></tr>
            <tr><td>108</td><td>Flux mix</td><td>Yes</td><td>No</td><td>0–127. Equivalent to flux+mix.</td></tr>
          </tbody>
        </table>
      </div>
      <p class="hint">Chart current as of firmware v1.2.0.</p>
    `
  },
  {
    id: "sdcard",
    section: "Storage & connectivity",
    title: "SD card",
    dek: "Tapes, tracks, saving and loading, and the config.txt settings file.",
    body: `
      <div class="callout callout-warning">Please lower your volume after loading files!</div>
      <div class="callout callout-note">To be recognized, the card must be inserted <strong>before</strong> powering up. Saving/loading is tested and reliable up to 32GB, FAT32 formatted; bigger cards may work but aren't fully tested. See <a href="#/page/microsd-cards">recommended microSD cards</a> if you're buying one.</div>

      <p>Storage is shared between decks, so a sample saved from one deck can be loaded into the other. On the card, everything lives inside the root folder <strong>SK</strong>. Saving a deck writes the buffer's contents as a <strong>32‑bit float, 48kHz, stereo WAV</strong> file, sized to the length of the recording.</p>

      <h3>Navigating: tapes and tracks</h3>
      <p>Files are grouped into folders called <em>tapes</em> — there are 6 of them, each holding up to 6 files called <em>tracks</em>, for 36 tracks total. Each tape is named for a color — blue, green, pink, red, turquoise, yellow — and its folder uses that color's first letter: <strong>B, G, P, R, T, Y</strong>. Audio files are named numerically, <code>1.WAV</code> … <code>6.WAV</code>.</p>
      <figure class="page-figure">
        <img src="images/tape-colors.jpg" alt="The six tape colors: blue, green, pink, red, turquoise, yellow" loading="lazy" />
      </figure>
      <ul>
        <li>To enter SD card mode, hold <code>tap</code> and tap the <code>play</code> pad of the deck you want to save/load. The ring lights up in 6 segments, in the color of the current tape (blue by default).</li>
        <li>Tap <code>trig</code> to switch between tapes. Spotykach remembers the last tape you selected (until power-off), and returns to it next time you enter SD card mode.</li>
        <li>The ring's segments represent the files in that tape: brighter segments are existing, non-empty files; dim ones are empty.</li>
        <li>Turn <code>pitch</code> to select a file — the selected segment lights up white.</li>
      </ul>

      <h3>Saving, loading, cancelling</h3>
      <p>After selecting a segment as above:</p>
      <ul>
        <li><strong>Save</strong> — tap <code>alt+play</code>. The ring shows progress in white. Saving to an occupied slot overwrites it.</li>
        <li><strong>Load</strong> — tap <code>play</code> or <code>alt+reverse</code>. The ring shows progress in the tape's color.</li>
        <li><strong>Exit / cancel</strong> — press <code>tap+play</code> to leave SD card mode without saving or loading, or to cancel a load in progress.</li>
      </ul>

      <h3>Importing audio</h3>
      <p>Name and place a file according to the structure above and Spotykach can load it directly (folders are created automatically once you save anything, but you can also create them by hand on an empty card). Files must be the same format Spotykach writes: <strong>32‑bit float, 48kHz, stereo WAV</strong>. If a file is shorter than 42 seconds, its length becomes the deck's maximum loop size; if it's longer, only the first 42 seconds load.</p>
      <div class="callout callout-tip"><strong>WAV.builder</strong> — a web app by Jon Waterschoot for managing samples: converts audio to the right format, maintains the tape/track folder structure, and includes a basic editor (trim, normalize, fades, automation, seamless looping) plus multi-project sample management. Still in heavy development — use with caution. <a href="https://jonwaterschoot.github.io/spotykach_WAV_builder/" target="_blank" rel="noopener">jonwaterschoot.github.io/spotykach_WAV_builder</a></div>

      <h3>Pre-loading audio</h3>
      <p>Whenever you load a sample into the buffer or save one to the card, Spotykach remembers the tape and slot, and reloads it automatically the next time the device powers on. If the sample is long, this can take a moment — cancel with <code>tap</code>+deck <code>play</code>, which also discards the pre-load memory for that deck. This information is stored in a <em>MEM</em> file in the SK folder. Pre-loading is on by default; disable it with the <code>pre_load</code> setting below.</p>

      <h3>config.txt</h3>
      <p>Some behaviors can be configured by adding a <strong>config.txt</strong> file to the root of the SK folder (or by editing settings through the WAV.builder web app). Setting names are plain alphanumerics and underscores; values are numeric and sit on the line right below the setting name:</p>
      <pre><code>setting_name
value</code></pre>
      <p>Example file contents:</p>
      <pre><code>mid_ch_b
5

mid_ps_a
1</code></pre>
      <div class="table-scroll">
        <table>
          <thead><tr><th>Setting</th><th>Name</th><th>Values</th><th>Default</th></tr></thead>
          <tbody>
            <tr><td>Deck A MIDI channel</td><td><code>mid_ch_a</code></td><td>1–16</td><td>1</td></tr>
            <tr><td>Deck B MIDI channel</td><td><code>mid_ch_b</code></td><td>1–16</td><td>2</td></tr>
            <tr><td>Start/Stop deck A from MIDI</td><td><code>mid_ps_a</code></td><td>0/1</td><td>0</td></tr>
            <tr><td>Start/Stop deck B from MIDI</td><td><code>mid_ps_b</code></td><td>0/1</td><td>0</td></tr>
            <tr><td>Enable/disable pre-loading</td><td><code>pre_load</code></td><td>0/1</td><td>1</td></tr>
            <tr><td>Disable polyphony, Slice deck A</td><td><code>slc_mn_a</code></td><td>0/1</td><td>0</td></tr>
            <tr><td>Disable polyphony, Slice deck B</td><td><code>slc_mn_b</code></td><td>0/1</td><td>0</td></tr>
          </tbody>
        </table>
      </div>
    `
  },
  {
    id: "microsd-cards",
    section: "Storage & connectivity",
    title: "Recommended microSD cards",
    dek: "Community-tested cards, and how to format one larger than 32GB to FAT32.",
    body: `
      <p>SD card support is still being tested and things may change. This list tracks cards known to work or fail as of firmware v0.0.30 alpha 2. See <a href="#/page/sdcard">SD card</a> for how to use the saving/loading features themselves.</p>
      <div class="callout callout-note">The card must be inserted before powering up. Saving/loading is tested and reliable up to 32GB, FAT32 formatted. To copy a WAV in from your computer: save it as 32‑bit float, 48kHz, stereo WAV — only the first 42 seconds will be used.</div>
      <div class="callout callout-tip">32GB is plenty for Spotykach: in theory it can hold up to <strong>21 hours</strong> of audio at Spotykach's 32‑bit float / 48kHz / stereo WAV format. Unless it's the only card on hand, anything larger is probably overkill.</div>

      <h3>Formatting a card larger than 32GB to FAT32</h3>
      <p><strong>Windows</strong> — the built-in Format dialog, diskpart, and friends all refuse to format volumes over 32GB as FAT32. The reliable workaround is a dedicated tool: <a href="http://ridgecrop.co.uk/index.htm?guiformat.htm" target="_blank" rel="noopener">guiformat</a> from Ridgecrop Consultants — no real options, it just formats to FAT32, and finishes in seconds. (Shared on Discord by a community member; the download triggers a Windows warning, but it's been tested and works as expected.)</p>
      <p><strong>macOS</strong> — open <em>Disk Utility</em> (Applications → Utilities, or Cmd+Space). Click <em>View → Show All Devices</em> so you can select the physical drive, not just a volume under it. Select it, click <em>Erase</em>, choose <strong>MS‑DOS (FAT)</strong> as the format and <strong>Master Boot Record</strong> as the scheme (important for 32GB+ drives), then click <em>Erase</em>.</p>
      <p><strong>Linux</strong> — on GNOME (Ubuntu, Fedora, …), use <em>GNOME Disks</em>: select the drive, open the format action, and pick "Compatible with all systems and devices (FAT)". On KDE Plasma, use <a href="https://apps.kde.org/partitionmanager/" target="_blank" rel="noopener">KDE Partition Manager</a>: right-click the partition → Format → fat32. Across distributions generally, <em>GParted</em> works the same way in two clicks.</p>

      <h3>Cards reported working</h3>
      <div class="table-scroll">
        <table>
          <thead><tr><th>Brand</th><th>Sizes tested</th></tr></thead>
          <tbody>
            <tr><td>SanDisk Ultra</td><td>32GB, 64GB, 128GB, 256GB</td></tr>
            <tr><td>SanDisk Extreme</td><td>32GB, 64GB, 128GB</td></tr>
            <tr><td>SanDisk Edge</td><td>8GB</td></tr>
            <tr><td>Kingston SDC10</td><td>32GB</td></tr>
            <tr><td>Toshiba M203</td><td>16GB</td></tr>
            <tr><td>Samsung EVO Plus</td><td>128GB (had initial errors, then worked fine)</td></tr>
          </tbody>
        </table>
      </div>

      <h3>Cards reported failing</h3>
      <div class="table-scroll">
        <table>
          <thead><tr><th>Brand</th><th>Sizes tested</th></tr></thead>
          <tbody>
            <tr><td>PNY Elite</td><td>32GB</td></tr>
            <tr><td>Netac Pro</td><td>16GB</td></tr>
            <tr><td>Generic / off-brand</td><td>2GB, 32GB</td></tr>
          </tbody>
        </table>
      </div>

      <figure class="page-figure">
        <img src="images/sdcard-working.jpg" alt="Photo of microSD cards reported to work with Spotykach" loading="lazy" />
        <figcaption>Working cards, submitted by a community member.</figcaption>
      </figure>
      <figure class="page-figure">
        <img src="images/sdcard-failing.jpg" alt="Photo of microSD cards reported to fail with Spotykach, including a PNY card that froze the unit" loading="lazy" />
        <figcaption>Cards that failed — e.g. the PNY cards were readable but froze Spotykach for around 15 seconds.</figcaption>
      </figure>

      <p class="hint">This list exists because SD card quality matters a lot for realtime sample playback — see Dirtywave's own <a href="https://dirtywave.com/pages/recommended-microsd-cards" target="_blank" rel="noopener">recommended microSD cards</a> for the M8 tracker, which reads samples straight off the card. It's not yet confirmed how closely that compares to Spotykach's use, which loads/saves to the Daisy's own memory rather than streaming live.</p>
    `
  },
  {
    id: "faq",
    section: "Reference",
    title: "FAQ",
    dek: "Common questions from the community, grouped by topic.",
    body: `
      <h3>Inputs, outputs and connectivity</h3>
      <dl class="faq">
        <dt>How do you change between stereo/mono mode — is it automatic based on the cable?</dt>
        <dd>No — the mode is set entirely by the physical routing switch, not detected from the cable. Options are Left (two independent mono decks), Center (stereo / single source into both decks), or Right (Generative Stereo mode).</dd>
        <dt>Are the individual inputs mono (TS) or stereo (TRS)?</dt>
        <dd>The inputs are two mono inputs. This has caused some confusion, since the product page describes "2 recording decks (both stereo)" — that's about the pair of inputs together, not TRS jacks; no TRS cable is required.</dd>
        <dt>What is the maximum loop buffer time?</dt>
        <dd>42 seconds per deck.</dd>
        <dt>What are the safe voltage ranges for inputs (e.g. for Eurorack)?</dt>
        <dd>Inputs accept line level up to Eurorack level. Output trim pots can also bring line level up to Eurorack level.</dd>
        <dt>What do the two Gate Outs do?</dt>
        <dd>Not implemented yet — planned for a future firmware release.</dd>
        <dt>Is the I/O mix knob a feedback control, or does it set the input/output blend?</dt>
        <dd>It sets the live blend of input signal vs. recorded/playback signal. Feedback has its own secondary function: alt + the mix knob.</dd>
      </dl>

      <h3>Power and troubleshooting</h3>
      <dl class="faq">
        <dt>Does recorded material survive a power cycle?</dt>
        <dd>Yes, via the micro SD card — see <a href="#/page/sdcard">SD card</a>.</dd>
        <dt>What power adapter do I need?</dt>
        <dd>USB‑C (5V 1A) or 15V 1A center positive, barrel diameter 5.5mm outside / 2.5mm inside. See <a href="#/page/powering">Powering the unit</a>.</dd>
        <dt>How do I get rid of the high-pitched whine when powering over USB?</dt>
        <dd>It's a ground loop from your computer's USB port — use a separate, non-computer USB power adapter instead.</dd>
        <dt>Is there an on/off switch?</dt>
        <dd>No — a hardware switch would require a full PCB redesign, so it's ruled out for now. Some users use a cable with a built-in switch.</dd>
        <dt>How do I update the firmware?</dt>
        <dd>Long-press the Reset button to enter firmware update mode, then connect over USB‑C.</dd>
      </dl>

      <h3>Controls and UX</h3>
      <dl class="faq">
        <dt>Does the Spotykach logo pad have a function?</dt>
        <dd>Planned for a future firmware update.</dd>
        <dt>How do I clear the buffers?</dt>
        <dd>There's currently no dedicated clear function — powering the unit off and on clears the buffers.</dd>
        <dt>Why is the pitch knob "fumbly" when using secondary (alt) functions?</dt>
        <dd>That's the visual catch-up / pick-up system: the knob only starts changing the secondary parameter once you've turned it back to that parameter's last position. See <a href="#/concept/visual-catchup">Visual catch-up</a>.</dd>
        <dt>Should un-selecting reverse return to play, instead of stopping?</dt>
        <dd>Currently, un-selecting reverse stops playback — this has come up as a live-performance UX preference, and is under discussion.</dd>
        <dt>How does the clock actually work?</dt>
        <dd>It drives playback/recording in Slice mode and the sequencer, expecting 4PPQN over TRS or 24PPQN over MIDI. See <a href="#/page/clock-tempo">Clock, tempo &amp; metronome</a> and <a href="#/concept/external-clock">External clock source</a>.</dd>
        <dt>How do I start/stop Spotykach from an external clock?</dt>
        <dd>Hold <code>tap</code> and tap <code>Trig A</code> to reset the clock — see <a href="#/concept/external-clock">External clock source</a>.</dd>
      </dl>

      <h3>Playback behavior</h3>
      <dl class="faq">
        <dt>Why does the tail of a loop get cut off when switching from Reel to Slice?</dt>
        <dd>In Slice mode, loop size is measured as a whole number of 1/16th notes at the tempo that was set when the sample was recorded or loaded, and that count always rounds down to avoid trailing silence. To make the loop play in full and stay tempo-synced, use the <code>tap+size</code> combo described in <a href="#/page/clock-tempo">Setting the tempo</a>.</dd>
      </dl>
    `
  },
  {
    id: "credits",
    section: "Reference",
    title: "Credits & downloads",
    dek: "Who made Spotykach, and the printed manual as a PDF.",
    body: `
      <p>Spotykach has been a collective effort, led by Roey Tsemah and Vlad Litvinenko, with support from the Synthux Community on Discord. Thank you for your support.</p>
      <div class="callout callout-note">The word "spotykach" translates from Ukrainian as "something that makes one stumble."</div>

      <h3>Design and development</h3>
      <p>Vlad Litvinenko, Roey Tsemah</p>

      <h3>Electronics engineering</h3>
      <p>Nick Donaldson, Infrasonic Audio</p>

      <h3>Printed manual</h3>
      <p>The original printed manual is a collaboration between graphic designer <a href="https://www.youtube.com/@conatusmodulari" target="_blank" rel="noopener">Fabio Bartali</a> and artist <a href="https://www.instagram.com/tomtebby/" target="_blank" rel="noopener">Tom Tebby</a>.</p>
      <ul>
        <li><a href="downloads/Spotykach_Quick_Manual_Feb_2026.pdf">Official printed manual (PDF)</a></li>
        <li><a href="downloads/Spotykach_Manual_A4_Print_Ready.pdf">A4 print-ready manual (PDF)</a></li>
      </ul>
      <figure class="page-figure">
        <img src="images/original-artwork.jpg" alt="Original artwork from the printed manual, by artist Tom Tebby" loading="lazy" />
        <figcaption>Original artwork from the printed manual, by <a href="https://www.instagram.com/tomtebby/" target="_blank" rel="noopener">Tom Tebby</a>.</figcaption>
      </figure>
    `
  }
];

// ---------------------------------------------------------------------------
// TOPICS — one atomic (control, mode) behavior per entry.
// `body` is plain text (escaped at render time), matching the rest of the
// manual's inline control names in backticks, e.g. `alt`, `size`.
// ---------------------------------------------------------------------------
const TOPICS = [
  // ---- Pitch / Speed ----
  {
    id: "pitch_reel",
    type: "control-in-mode",
    facets: { mode: "reel", control: "pitch" },
    title: "Pitch / Speed — Reel mode",
    body: "Turning the knob adjusts playback speed, which in turn changes pitch — they're locked together, tape-style. Clockwise speeds the playhead up; counter-clockwise slows it down until it stops.",
    relations: [
      { type: "references-concept", target: "alt-function" },
      { type: "references-concept", target: "visual-catchup" }
    ]
  },
  {
    id: "pitch_slice",
    type: "control-in-mode",
    facets: { mode: "slice", control: "pitch" },
    title: "Pitch / Speed — Slice mode",
    body: "Turning the knob changes pitch while playback speed stays the same — functioning as independent pitch-shifting, since Slice mode's speed is already set by the clock.",
    relations: [
      { type: "references-concept", target: "alt-function" },
      { type: "references-concept", target: "visual-catchup" }
    ]
  },
  {
    id: "pitch_drift",
    type: "control-in-mode",
    facets: { mode: "drift", control: "pitch" },
    title: "Pitch / Speed — Drift mode",
    body: "Works similarly to Reel mode, but because Drift builds sound from overlapping grains rather than a single playhead, changes in speed are far less prominent.",
    relations: [
      { type: "references-concept", target: "alt-function" },
      { type: "references-concept", target: "visual-catchup" }
    ]
  },

  // ---- Position ----
  {
    id: "position_reel",
    type: "control-in-mode",
    facets: { mode: "reel", control: "position" },
    title: "Position — Reel mode",
    body: "Sets the loop's starting point. Tip: pair a small Size setting with the Position knob to get a time-stretching/scanning effect.",
    relations: [
      { type: "references-concept", target: "visual-catchup" }
    ]
  },
  {
    id: "position_slice",
    type: "control-in-mode",
    facets: { mode: "slice", control: "position" },
    title: "Position — Slice mode",
    body: "Sets the loop's starting point, quantized to 1/8th notes at the tempo that was set when the sample was recorded. Tip: align tempo to the loaded sample's length first (`tap+size`) so the quantized position lands on onsets more cleanly.",
    relations: [
      { type: "references-concept", target: "key-beat" },
      { type: "references-concept", target: "visual-catchup" }
    ]
  },
  {
    id: "position_drift",
    type: "control-in-mode",
    facets: { mode: "drift", control: "position" },
    title: "Position — Drift mode",
    body: "Sets the middle of the grain \"cloud\" — the point grains scatter around. Distribution is random, weighted so grains land more often closer to the middle.",
    relations: [
      { type: "references-concept", target: "visual-catchup" }
    ]
  },

  // ---- Size ----
  {
    id: "size_reel",
    type: "control-in-mode",
    facets: { mode: "reel", control: "size" },
    title: "Size — Reel mode",
    body: "Sets the loop's length. The response is exponential: near zero, small knob movements make small length changes, so short loops are easy to fine-tune; further out, the same movement changes the length much more.",
    relations: [
      { type: "references-concept", target: "visual-catchup" }
    ]
  },
  {
    id: "size_slice",
    type: "control-in-mode",
    facets: { mode: "slice", control: "size" },
    title: "Size — Slice mode",
    body: "Rounded down to a whole count of 16th-note intervals at the tempo set when the recording was made. The response is linear — the same knob movement always changes size by the same amount across the whole range. `alt+size` toggles the deck between mono and poly voicing.",
    relations: [
      { type: "references-concept", target: "polyphony" },
      { type: "references-concept", target: "visual-catchup" }
    ]
  },
  {
    id: "size_drift",
    type: "control-in-mode",
    facets: { mode: "drift", control: "size" },
    title: "Size — Drift mode",
    body: "Sets the spread of grains around the point set by Position (linear response). `alt+size` sets grain size instead.",
    relations: [
      { type: "references-concept", target: "visual-catchup" }
    ]
  },

  // ---- Envelope ----
  {
    id: "envelope_reel",
    type: "control-in-mode",
    facets: { mode: "reel", control: "envelope" },
    title: "Envelope — Reel mode",
    body: "Shapes the loop's amplitude across its full length, from off, to fade-out, to fade-in/out, to fade-in.",
    relations: [
      { type: "references-concept", target: "visual-catchup" }
    ]
  },
  {
    id: "envelope_slice",
    type: "control-in-mode",
    facets: { mode: "slice", control: "envelope" },
    title: "Envelope — Slice mode",
    body: "Shapes the loop's amplitude across its full length, from off, to fade-out, to fade-in/out, to fade-in — same behavior as Reel mode.",
    relations: [
      { type: "references-concept", target: "visual-catchup" }
    ]
  },
  {
    id: "envelope_drift",
    type: "control-in-mode",
    facets: { mode: "drift", control: "envelope" },
    title: "Envelope — Drift mode",
    body: "At 0 (the default), the deck enters a suspended state where the granular cloud just drones — the `trig` pad and gate-in signals are ignored while suspended. Above 0, it re-triggers the envelope instead. `alt+envelope` sets the envelope's length, though that setting has no effect while suspended.",
    relations: [
      { type: "references-concept", target: "visual-catchup" }
    ]
  },

  // ---- Mix ----
  {
    id: "mix_reel",
    type: "control-in-mode",
    facets: { mode: "reel", control: "mix" },
    title: "Mix — Reel mode",
    body: "Blends the deck's live input against its internal buffer. `alt+mix` sets overdub feedback — how much of the existing loop decays with each overdub pass.",
    relations: [
      { type: "references-concept", target: "overdubbing" },
      { type: "references-concept", target: "alt-function" }
    ]
  },
  {
    id: "mix_slice",
    type: "control-in-mode",
    facets: { mode: "slice", control: "mix" },
    title: "Mix — Slice mode",
    body: "Blends the deck's live input against its internal buffer. `alt+mix` sets overdub feedback — how much of the existing loop decays with each overdub pass.",
    relations: [
      { type: "references-concept", target: "overdubbing" },
      { type: "references-concept", target: "alt-function" }
    ]
  },
  {
    id: "mix_drift",
    type: "control-in-mode",
    facets: { mode: "drift", control: "mix" },
    title: "Mix — Drift mode",
    body: "Blends the deck's live input against its internal buffer. `alt+mix` sets overdub feedback — how much of the existing loop decays with each overdub pass.",
    relations: [
      { type: "references-concept", target: "overdubbing" },
      { type: "references-concept", target: "alt-function" }
    ]
  },

  // ---- Trig ----
  {
    id: "trig_reel",
    type: "control-in-mode",
    facets: { mode: "reel", control: "trig" },
    title: "Trig — Reel mode",
    body: "Re-triggers playback from the loop's start point.",
    relations: []
  },
  {
    id: "trig_slice",
    type: "control-in-mode",
    facets: { mode: "slice", control: "trig" },
    title: "Trig — Slice mode",
    body: "In mono voicing (`alt+size` fully counter-clockwise): re-triggers playback. In polyphonic voicing (`alt+size` fully clockwise, the default): triggers up to 3 simultaneous voices, using voice stealing once all three are busy.",
    relations: [
      { type: "references-concept", target: "polyphony" }
    ]
  },
  {
    id: "trig_drift",
    type: "control-in-mode",
    facets: { mode: "drift", control: "trig" },
    title: "Trig — Drift mode",
    body: "If `envelope` is fully counter-clockwise, Trig is ignored entirely — the deck can only be started or stopped with `play`/`reverse`. If `envelope` is above that, Trig re-triggers the envelope.",
    relations: []
  },

  // ---- Record / Arm ----
  {
    id: "record_reel",
    type: "control-in-mode",
    facets: { mode: "reel", control: "record" },
    title: "Record / Arm — Reel mode",
    body: "Tap `alt+play` to arm the deck — the play LED blinks red while armed. Recording starts automatically once the input signal crosses -40dB. Tap `play` to stop recording and immediately begin loop playback. Make sure input levels are high enough for the detector to trigger.",
    relations: [
      { type: "references-concept", target: "overdubbing" },
      { type: "references-concept", target: "resampling" }
    ]
  },
  {
    id: "record_slice",
    type: "control-in-mode",
    facets: { mode: "slice", control: "record" },
    title: "Record / Arm — Slice mode",
    body: "Tap `alt+play` to arm the deck — the play LED blinks red while armed. Recording and playback are quantized by default: recording starts on the next Key Beat after arming, and stops on the next Key Beat after tapping `play` or `reverse`.",
    relations: [
      { type: "references-concept", target: "key-beat" },
      { type: "references-concept", target: "overdubbing" },
      { type: "references-concept", target: "resampling" }
    ]
  },
  {
    id: "record_drift",
    type: "control-in-mode",
    facets: { mode: "drift", control: "record" },
    title: "Record / Arm — Drift mode",
    body: "Tap `alt+play` to arm the deck — the play LED blinks red while armed. Recording starts automatically once the input signal crosses -40dB. Tap `play` to stop recording and immediately begin loop playback. Make sure input levels are high enough for the detector to trigger.",
    relations: [
      { type: "references-concept", target: "overdubbing" },
      { type: "references-concept", target: "resampling" }
    ]
  }
];

window.SPOTYKACH_DATA = { MODES, CONTROLS, CONCEPTS, PAGES, TOPICS };

})();
