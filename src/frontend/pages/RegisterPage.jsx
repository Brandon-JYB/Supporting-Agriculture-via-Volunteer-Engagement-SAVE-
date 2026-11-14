import { useEffect, useState } from "react";
import Section from "../components/Section";
import { getFarms, submitRegistration, saveContactPreferences, submitFeedback, submitInquiry } from "../api/Client";

const STEPS = [
    "Email & Number",
    "Farm Selection",
    "Confirm Match",
    "Confirmation",
    "Keep In Touch",
];

const MODES = [
    {
        id: "register",
        label: "Register",
        eyebrow: "ready to join?",
        title: "Register here",
        lede: "Five quick steps and you're matched with a farm.",
    },
    {
        id: "feedback",
        label: "Feedback",
        eyebrow: "welcome back",
        title: "Share your feedback",
        lede: "Already volunteered with us? Tell us how it went.",
    },
    {
        id: "inquiry",
        label: "Ask Question",
        eyebrow: "not sure yet?",
        title: "Ask us anything",
        lede: "Got a question the site doesn't answer? Send it over and we'll reply by email.",
    },
];

const TOPICS = [
    { value: "general", label: "General question" },
    { value: "requirements", label: "Requirements & eligibility" },
    { value: "farms", label: "Farms & locations" },
    { value: "safety", label: "Safety & what to bring" },
    { value: "partnership", label: "Schools & partnerships" },
];

const EMPTY_FORM = {
    fullName: "",
    email: "",
    phone: "",
    preferredDate: "",
    farmId: "",
    emailUpdates: true,
    smsUpdates: false,
};

const EMPTY_FEEDBACK = {
    fullName: "",
    email: "",
    farmId: "",
    rating: "",
    comments: "",
    canShare: false,
};

const EMPTY_INQUIRY = {
    fullName: "",
    email: "",
    topic: "general",
    message: "",
};

/* ------------------------------------------------------------------ */
/* Small reusable field wrapper                                        */
/* ------------------------------------------------------------------ */
function Field({ id, label, error, hint, children }) {
    return (
        <div className="reg-field">
            <label htmlFor={id}>{label}</label>
            {children}
            {hint && !error && <p className="reg-hint">{hint}</p>}
            {error && (
                <p className="reg-error" id={`${id}-error`} role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}

export default function RegisterPage() {
    const [mode, setMode] = useState("register"); // "register" | "feedback" | "inquiry"
    const [step, setStep] = useState(0);
    const [form, setForm] = useState(EMPTY_FORM);
    const [feedback, setFeedback] = useState(EMPTY_FEEDBACK);
    const [inquiry, setInquiry] = useState(EMPTY_INQUIRY);
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);
    const [referenceCode, setReferenceCode] = useState("");
    const [registrationDone, setRegistrationDone] = useState(false);
    const [feedbackDone, setFeedbackDone] = useState(false);
    const [inquiryDone, setInquiryDone] = useState(false);

    const [farms, setFarms] = useState([]);
    const [farmsError, setFarmsError] = useState("");

    useEffect(() => {
        getFarms()
            .then(setFarms)
            .catch(() => setFarmsError("We couldn't load the farm list. Refresh the page to try again."));
    }, []);

    const selectedFarm = farms.find((farm) => farm.id === form.farmId);
    const current = MODES.find((m) => m.id === mode);

    /* ---------- helpers ---------- */
    function makeUpdater(setter) {
        return (event) => {
            const { name, value, type, checked } = event.target;
            setter((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        };
    }

    const updateForm = makeUpdater(setForm);
    const updateFeedback = makeUpdater(setFeedback);
    const updateInquiry = makeUpdater(setInquiry);

    function switchMode(nextMode) {
        setMode(nextMode);
        setErrors({});
    }

    function resetAll() {
        setForm(EMPTY_FORM);
        setFeedback(EMPTY_FEEDBACK);
        setInquiry(EMPTY_INQUIRY);
        setStep(0);
        setReferenceCode("");
        setRegistrationDone(false);
        setFeedbackDone(false);
        setInquiryDone(false);
        setErrors({});
    }

    /* ---------- validation ---------- */
    function validateStep1() {
        const next = {};
        if (!form.fullName.trim()) next.fullName = "Enter your full name.";
        if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
        // Accepts 09XXXXXXXXX, 9XXXXXXXXX and +639XXXXXXXXX
        const digits = form.phone.replace(/[\s-]/g, "");
        if (!/^(\+63|0)?9\d{9}$/.test(digits)) next.phone = "Enter a valid mobile number, like 0917 123 4567.";
        if (!form.preferredDate) next.preferredDate = "Pick the date you'd like to join.";
        return next;
    }

    function validateStep2() {
        return form.farmId ? {} : { farmId: "Choose a farm to continue." };
    }

    function validateFeedback() {
        const next = {};
        if (!feedback.fullName.trim()) next.fullName = "Enter your full name.";
        if (!/^\S+@\S+\.\S+$/.test(feedback.email)) next.email = "Enter the email you registered with.";
        if (!feedback.farmId) next.farmId = "Choose the farm you volunteered at.";
        if (!feedback.rating) next.rating = "Choose a rating.";
        if (!feedback.comments.trim()) next.comments = "Tell us a little about how it went.";
        return next;
    }

    function validateInquiry() {
        const next = {};
        if (!inquiry.fullName.trim()) next.fullName = "Enter your name.";
        if (!/^\S+@\S+\.\S+$/.test(inquiry.email)) next.email = "Enter an email we can reply to.";
        if (inquiry.message.trim().length < 10) next.message = "Write your question so we can help (a sentence or two is plenty).";
        return next;
    }

    /* ---------- actions ---------- */
    function goNext() {
        const found = step === 0 ? validateStep1() : step === 1 ? validateStep2() : {};
        if (Object.keys(found).length) {
            setErrors(found);
            return;
        }
        setErrors({});
        setStep((s) => s + 1);
    }

    function goBack() {
        setErrors({});
        setStep((s) => Math.max(0, s - 1));
    }

    async function confirmMatch() {
        setBusy(true);
        try {
            const result = await submitRegistration(form);
            setReferenceCode(result.referenceCode);
            setStep(3);
        } catch {
            setErrors({ form: "We couldn't submit your registration. Check your connection and try again." });
        } finally {
            setBusy(false);
        }
    }

    async function finishContactPrefs() {
        setBusy(true);
        try {
            await saveContactPreferences(referenceCode, {
                emailUpdates: form.emailUpdates,
                smsUpdates: form.smsUpdates,
            });
            setRegistrationDone(true);
        } catch {
            setErrors({ form: "We couldn't save your preferences. Try again." });
        } finally {
            setBusy(false);
        }
    }

    async function handleFeedbackSubmit(event) {
        event.preventDefault();
        const found = validateFeedback();
        if (Object.keys(found).length) {
            setErrors(found);
            return;
        }
        setBusy(true);
        try {
            await submitFeedback(feedback);
            setFeedbackDone(true);
        } catch {
            setErrors({ form: "We couldn't send your feedback. Try again." });
        } finally {
            setBusy(false);
        }
    }

    async function handleInquirySubmit(event) {
        event.preventDefault();
        const found = validateInquiry();
        if (Object.keys(found).length) {
            setErrors(found);
            return;
        }
        setBusy(true);
        try {
            await submitInquiry(inquiry);
            setInquiryDone(true);
        } catch {
            setErrors({ form: "We couldn't send your question. Try again." });
        } finally {
            setBusy(false);
        }
    }

    /* ---------- render: registration steps ---------- */
    function renderStep() {
        switch (step) {
            case 0:
                return (
                    <>
                        <h2 className="reg-step-title">Your contact details</h2>
                        <Field id="fullName" label="Full name" error={errors.fullName}>
                            <input id="fullName" name="fullName" type="text" autoComplete="name"
                                value={form.fullName} onChange={updateForm}
                                aria-invalid={!!errors.fullName} aria-describedby={errors.fullName ? "fullName-error" : undefined} />
                        </Field>
                        <Field id="email" label="Email" error={errors.email}>
                            <input id="email" name="email" type="email" autoComplete="email"
                                value={form.email} onChange={updateForm}
                                aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
                        </Field>
                        <Field id="phone" label="Mobile number" error={errors.phone} hint="We use this to confirm your match.">
                            <input id="phone" name="phone" type="tel" autoComplete="tel"
                                value={form.phone} onChange={updateForm}
                                aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} />
                        </Field>
                        <Field id="preferredDate" label="Preferred date" error={errors.preferredDate}>
                            <input id="preferredDate" name="preferredDate" type="date"
                                value={form.preferredDate} onChange={updateForm}
                                aria-invalid={!!errors.preferredDate} aria-describedby={errors.preferredDate ? "preferredDate-error" : undefined} />
                        </Field>
                    </>
                );

            case 1:
                return (
                    <>
                        <h2 className="reg-step-title">Choose a farm</h2>
                        <fieldset className="reg-farms">
                            <legend className="reg-sr-only">Available farms</legend>
                            {farmsError && <p className="reg-error" role="alert">{farmsError}</p>}
                            {farms.map((farm) => (
                                <label key={farm.id} className="reg-farm">
                                    <input type="radio" name="farmId" value={farm.id}
                                        checked={form.farmId === farm.id} onChange={updateForm} />
                                    <span className="reg-farm__body">
                                        <span className="reg-farm__name">{farm.name}</span>
                                        <span className="reg-farm__meta">{farm.location} · {farm.focus}</span>
                                        <span className="reg-farm__slots">{farm.slots} spots left</span>
                                    </span>
                                </label>
                            ))}
                        </fieldset>
                        {errors.farmId && <p className="reg-error" role="alert">{errors.farmId}</p>}
                    </>
                );

            case 2:
                return (
                    <>
                        <h2 className="reg-step-title">Confirm your match</h2>
                        <dl className="reg-summary">
                            <div><dt>Name</dt><dd>{form.fullName}</dd></div>
                            <div><dt>Email</dt><dd>{form.email}</dd></div>
                            <div><dt>Mobile</dt><dd>{form.phone}</dd></div>
                            <div><dt>Date</dt><dd>{form.preferredDate}</dd></div>
                            <div><dt>Farm</dt><dd>{selectedFarm ? `${selectedFarm.name}, ${selectedFarm.location}` : ""}</dd></div>
                        </dl>
                        <p className="reg-hint">Something wrong? Use Back to fix it before you confirm.</p>
                    </>
                );

            case 3:
                return (
                    <div className="reg-center">
                        <h2 className="reg-step-title">You're registered</h2>
                        <p>We sent a confirmation to <strong>{form.email}</strong>.</p>
                        <p className="reg-code">Reference code: <strong>{referenceCode}</strong></p>
                        <p className="reg-hint">Keep this code. You'll need it if you want to change your registration.</p>
                    </div>
                );

            case 4:
                return registrationDone ? (
                    <div className="reg-center">
                        <h2 className="reg-step-title">All set</h2>
                        <p>We'll be in touch before your visit to {selectedFarm?.name}.</p>
                    </div>
                ) : (
                    <>
                        <h2 className="reg-step-title">Keep in touch</h2>
                        <p>How should we reach you about your visit?</p>
                        <label className="reg-check">
                            <input type="checkbox" name="emailUpdates" checked={form.emailUpdates} onChange={updateForm} />
                            <span>Email me reminders and updates</span>
                        </label>
                        <label className="reg-check">
                            <input type="checkbox" name="smsUpdates" checked={form.smsUpdates} onChange={updateForm} />
                            <span>Text me reminders</span>
                        </label>
                    </>
                );

            default:
                return null;
        }
    }

    function renderActions() {
        if (step === 0) return <button type="button" className="reg-btn" onClick={goNext}>Choose a farm</button>;
        if (step === 1)
            return (
                <>
                    <button type="button" className="reg-btn reg-btn--ghost" onClick={goBack}>Back</button>
                    <button type="button" className="reg-btn" onClick={goNext}>Review match</button>
                </>
            );
        if (step === 2)
            return (
                <>
                    <button type="button" className="reg-btn reg-btn--ghost" onClick={goBack} disabled={busy}>Back</button>
                    <button type="button" className="reg-btn" onClick={confirmMatch} disabled={busy}>
                        {busy ? "Confirming…" : "Confirm registration"}
                    </button>
                </>
            );
        if (step === 3)
            return <button type="button" className="reg-btn" onClick={() => setStep(4)}>Set contact preferences</button>;
        if (step === 4 && !registrationDone)
            return (
                <button type="button" className="reg-btn" onClick={finishContactPrefs} disabled={busy}>
                    {busy ? "Saving…" : "Save preferences"}
                </button>
            );
        return <button type="button" className="reg-btn reg-btn--ghost" onClick={resetAll}>Register someone else</button>;
    }

    /* ---------- render: feedback mode ---------- */
    function renderFeedback() {
        if (feedbackDone) {
            return (
                <div className="reg-center">
                    <h2 className="reg-step-title">Thanks for the feedback</h2>
                    <p>It helps us improve the program for the next group of volunteers.</p>
                    <div className="reg-actions">
                        <button type="button" className="reg-btn reg-btn--ghost" onClick={resetAll}>Done</button>
                    </div>
                </div>
            );
        }

        return (
            <form onSubmit={handleFeedbackSubmit} noValidate>
                <h2 className="reg-step-title">How did it go?</h2>
                <Field id="fb-fullName" label="Full name" error={errors.fullName}>
                    <input id="fb-fullName" name="fullName" type="text" autoComplete="name"
                        value={feedback.fullName} onChange={updateFeedback}
                        aria-invalid={!!errors.fullName} aria-describedby={errors.fullName ? "fb-fullName-error" : undefined} />
                </Field>
                <Field id="fb-email" label="Email you registered with" error={errors.email}>
                    <input id="fb-email" name="email" type="email" autoComplete="email"
                        value={feedback.email} onChange={updateFeedback}
                        aria-invalid={!!errors.email} aria-describedby={errors.email ? "fb-email-error" : undefined} />
                </Field>
                <Field id="fb-farmId" label="Farm you volunteered at" error={errors.farmId}>
                    <select id="fb-farmId" name="farmId" value={feedback.farmId} onChange={updateFeedback}
                        aria-invalid={!!errors.farmId} aria-describedby={errors.farmId ? "fb-farmId-error" : undefined}>
                        <option value="">Select a farm</option>
                        {farms.map((farm) => (
                            <option key={farm.id} value={farm.id}>{farm.name}</option>
                        ))}
                    </select>
                </Field>

                <fieldset className="reg-rating">
                    <legend>Overall experience</legend>
                    {[1, 2, 3, 4, 5].map((n) => (
                        <label key={n}>
                            <input type="radio" name="rating" value={String(n)}
                                checked={feedback.rating === String(n)} onChange={updateFeedback} />
                            <span>{n}</span>
                        </label>
                    ))}
                    <p className="reg-hint">1 = poor, 5 = great</p>
                </fieldset>
                {errors.rating && <p className="reg-error" role="alert">{errors.rating}</p>}

                <Field id="fb-comments" label="What went well, and what should we change?" error={errors.comments}>
                    <textarea id="fb-comments" name="comments" rows="5"
                        value={feedback.comments} onChange={updateFeedback}
                        aria-invalid={!!errors.comments} aria-describedby={errors.comments ? "fb-comments-error" : undefined} />
                </Field>

                <label className="reg-check">
                    <input type="checkbox" name="canShare" checked={feedback.canShare} onChange={updateFeedback} />
                    <span>You can share my feedback on the website</span>
                </label>

                {errors.form && <p className="reg-error" role="alert">{errors.form}</p>}

                <div className="reg-actions">
                    <button type="submit" className="reg-btn" disabled={busy}>
                        {busy ? "Sending…" : "Send feedback"}
                    </button>
                </div>
            </form>
        );
    }

    /* ---------- render: inquiry mode ---------- */
    function renderInquiry() {
        if (inquiryDone) {
            return (
                <div className="reg-center">
                    <h2 className="reg-step-title">Question sent</h2>
                    <p>We'll reply to <strong>{inquiry.email}</strong> as soon as we can.</p>
                    <div className="reg-actions">
                        <button type="button" className="reg-btn reg-btn--ghost" onClick={resetAll}>Ask another</button>
                    </div>
                </div>
            );
        }

        return (
            <form onSubmit={handleInquirySubmit} noValidate>
                <h2 className="reg-step-title">What would you like to know?</h2>
                <Field id="inq-fullName" label="Your name" error={errors.fullName}>
                    <input id="inq-fullName" name="fullName" type="text" autoComplete="name"
                        value={inquiry.fullName} onChange={updateInquiry}
                        aria-invalid={!!errors.fullName} aria-describedby={errors.fullName ? "inq-fullName-error" : undefined} />
                </Field>
                <Field id="inq-email" label="Email" error={errors.email} hint="We'll reply here.">
                    <input id="inq-email" name="email" type="email" autoComplete="email"
                        value={inquiry.email} onChange={updateInquiry}
                        aria-invalid={!!errors.email} aria-describedby={errors.email ? "inq-email-error" : undefined} />
                </Field>
                <Field id="inq-topic" label="Topic">
                    <select id="inq-topic" name="topic" value={inquiry.topic} onChange={updateInquiry}>
                        {TOPICS.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </select>
                </Field>
                <Field id="inq-message" label="Your question" error={errors.message}>
                    <textarea id="inq-message" name="message" rows="5"
                        value={inquiry.message} onChange={updateInquiry}
                        aria-invalid={!!errors.message} aria-describedby={errors.message ? "inq-message-error" : undefined} />
                </Field>

                {errors.form && <p className="reg-error" role="alert">{errors.form}</p>}

                <div className="reg-actions">
                    <button type="submit" className="reg-btn" disabled={busy}>
                        {busy ? "Sending…" : "Send question"}
                    </button>
                </div>
            </form>
        );
    }

    /* ---------- page ---------- */
    return (
        <Section id="Register" tone="light">
            <div className="reg">
                <header className="reg-header">
                    <p className="reg-eyebrow">{current.eyebrow}</p>
                    <h1>{current.title}</h1>
                    <p className="reg-lede">{current.lede}</p>
                </header>

                <div className="reg-modes" role="group" aria-label="What would you like to do?">
                    {MODES.map((m) => (
                        <button
                            key={m.id}
                            type="button"
                            className={"reg-mode" + (mode === m.id ? " is-active" : "")}
                            aria-pressed={mode === m.id}
                            onClick={() => switchMode(m.id)}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>

                <div className="reg-card">
                    {mode === "register" && (
                        <>
                            <ol className="reg-steps" aria-label="Registration progress">
                                {STEPS.map((label, index) => (
                                    <li key={label}
                                        className={
                                            "reg-steps__item" +
                                            (index === step ? " is-current" : "") +
                                            (index < step || registrationDone ? " is-done" : "")
                                        }
                                        aria-current={index === step ? "step" : undefined}>
                                        <span className="reg-steps__num">{index + 1}</span>
                                        <span className="reg-steps__label">{label}</span>
                                    </li>
                                ))}
                            </ol>
                            <div className="reg-panel">
                                {renderStep()}
                                {errors.form && <p className="reg-error" role="alert">{errors.form}</p>}
                                <div className="reg-actions">{renderActions()}</div>
                            </div>
                        </>
                    )}

                    {mode === "feedback" && <div className="reg-panel">{renderFeedback()}</div>}
                    {mode === "inquiry" && <div className="reg-panel">{renderInquiry()}</div>}
                </div>
            </div>
        </Section>
    );
}