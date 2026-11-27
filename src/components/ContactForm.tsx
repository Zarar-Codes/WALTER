import { FormEvent, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';
import { BUSINESS_INFO, PROJECT_TYPE_OPTIONS } from '../data/siteData';

interface ContactFormProps {
  preselectedProjectType: string;
}

interface FormValues {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  projectType: string;
  details: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
}

export function ContactForm({ preselectedProjectType }: ContactFormProps) {
  const [values, setValues] = useState<FormValues>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    projectType: preselectedProjectType || PROJECT_TYPE_OPTIONS[0],
    details: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'submitted'>('idle');
  const [submittedSnapshot, setSubmittedSnapshot] = useState<FormValues | null>(null);

  useEffect(() => {
    if (preselectedProjectType) {
      setValues((prev) => ({ ...prev, projectType: preselectedProjectType }));
    }
  }, [preselectedProjectType]);

  const validate = (form: FormValues): FormErrors => {
    const nextErrors: FormErrors = {};
    if (!form.fullName.trim()) {
      nextErrors.fullName = 'Please enter your full name.';
    }
    if (!form.email.trim()) {
      nextErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (
      form.phone.trim() &&
      !/^[0-9+\-().\s]{7,22}$/.test(form.phone.trim())
    ) {
      nextErrors.phone = 'Please enter a valid phone number or leave it blank.';
    }
    return nextErrors;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus('submitting');
    // Demo interface submission simulation (production endpoint integration noted clearly in success UI)
    window.setTimeout(() => {
      setSubmittedSnapshot({ ...values });
      setStatus('submitted');
    }, 650);
  };

  const buildMailtoHref = (snap: FormValues) => {
    const subject = encodeURIComponent(
      `Consultation Request: ${snap.projectType} — ${snap.fullName}`
    );
    const body = encodeURIComponent(
      [
        `Name: ${snap.fullName}`,
        `Email: ${snap.email}`,
        snap.phone ? `Phone: ${snap.phone}` : null,
        snap.location ? `Property Location: ${snap.location}` : null,
        `Type of Project: ${snap.projectType}`,
        snap.details ? `\nProject Details:\n${snap.details}` : null,
      ]
        .filter(Boolean)
        .join('\n')
    );
    return `mailto:${BUSINESS_INFO.email}?subject=${subject}&body=${body}`;
  };

  const handleReset = () => {
    setValues({
      fullName: '',
      email: '',
      phone: '',
      location: '',
      projectType: PROJECT_TYPE_OPTIONS[0],
      details: '',
    });
    setErrors({});
    setStatus('idle');
    setSubmittedSnapshot(null);
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-white py-20 sm:py-28 lg:py-32"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Verified Business Details */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5 }}
                className="text-xs font-semibold tracking-[0.2em] uppercase text-[#008F24] mb-4"
              >
                Get in Touch
              </motion.p>
              <motion.h2
                id="contact-heading"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-bold text-[#192647] tracking-[-0.03em] leading-[1.02] text-[clamp(2.1rem,4.1vw,3.85rem)]"
              >
                LET&apos;S START
                <br />
                WITH YOUR{' '}
                <span className="font-editorial italic font-medium text-[#008F24] tracking-normal">
                  Ideas.
                </span>
              </motion.h2>
              <p className="mt-5 text-base sm:text-lg text-[#242824]/80 leading-relaxed">
                Tell us about your outdoor project and what you would like to
                create. The Walter&apos;s team can help you take the next step.
              </p>
            </div>

            <div className="border-t border-[#DCE2DC] pt-7 space-y-6">
              <p className="font-display font-bold text-sm tracking-[0.16em] uppercase text-[#192647]">
                {BUSINESS_INFO.name}
              </p>

              <dl className="space-y-5 text-[15px]">
                <div className="flex items-start gap-3.5">
                  <MapPin
                    className="w-5 h-5 text-[#008F24] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-xs font-semibold tracking-[0.14em] uppercase text-[#747B76] mb-1">
                      Address
                    </dt>
                    <dd className="text-[#242824] leading-snug">
                      {BUSINESS_INFO.addressLine1}
                      <br />
                      {BUSINESS_INFO.addressLine2}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Phone
                    className="w-5 h-5 text-[#008F24] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-xs font-semibold tracking-[0.14em] uppercase text-[#747B76] mb-1">
                      Phone
                    </dt>
                    <dd>
                      <a
                        href={BUSINESS_INFO.phoneHref}
                        className="font-display font-semibold text-lg text-[#192647] hover:text-[#008F24] transition-colors tabular-nums"
                      >
                        {BUSINESS_INFO.phoneDisplay}
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Mail
                    className="w-5 h-5 text-[#008F24] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-xs font-semibold tracking-[0.14em] uppercase text-[#747B76] mb-1">
                      Email
                    </dt>
                    <dd>
                      <a
                        href={BUSINESS_INFO.emailHref}
                        className="text-[#192647] hover:text-[#008F24] underline decoration-[#A8B3A4] underline-offset-4 transition-colors break-all"
                      >
                        {BUSINESS_INFO.email}
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Clock
                    className="w-5 h-5 text-[#008F24] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-xs font-semibold tracking-[0.14em] uppercase text-[#747B76] mb-1">
                      Office Hours
                    </dt>
                    <dd className="text-[#242824]">{BUSINESS_INFO.hours}</dd>
                  </div>
                </div>
              </dl>

              {/* Verified Social Links */}
              <div className="pt-4 border-t border-[#ECEFED] flex items-center gap-6">
                <a
                  href={BUSINESS_INFO.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-display font-semibold tracking-[0.14em] uppercase text-[#192647] hover:text-[#008F24] transition-colors"
                >
                  Facebook
                </a>
                <span aria-hidden="true" className="text-[#A8B3A4]">
                  ·
                </span>
                <a
                  href={BUSINESS_INFO.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-display font-semibold tracking-[0.14em] uppercase text-[#192647] hover:text-[#008F24] transition-colors"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Consultation Inquiry Form */}
          <div className="lg:col-span-7 bg-[#F7F8F5] border border-[#DCE2DC] p-7 sm:p-10 lg:p-12">
            {status === 'submitted' && submittedSnapshot ? (
              <div
                role="status"
                aria-live="polite"
                className="space-y-6 py-4"
              >
                <div className="inline-flex items-center gap-2.5 text-[#008F24]">
                  <CheckCircle2 className="w-6 h-6 shrink-0" aria-hidden="true" />
                  <span className="text-xs font-semibold tracking-[0.18em] uppercase">
                    Demo Inquiry Prepared
                  </span>
                </div>

                <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#192647]">
                  Thank you, {submittedSnapshot.fullName}. Your consultation
                  details are ready.
                </h3>

                <p className="text-sm sm:text-base text-[#242824]/80 leading-relaxed">
                  <strong>Demo interface notice:</strong> No backend email
                  server is connected to this preview, so this form has not
                  transmitted an email automatically. In production, connect
                  this form handler to your server endpoint or CRM webhook.
                </p>

                <div className="bg-white border border-[#DCE2DC] p-5 text-sm space-y-1.5 text-[#242824]">
                  <p>
                    <span className="text-[#747B76]">Project Type:</span>{' '}
                    <strong>{submittedSnapshot.projectType}</strong>
                  </p>
                  <p>
                    <span className="text-[#747B76]">Email:</span>{' '}
                    {submittedSnapshot.email}
                  </p>
                  {submittedSnapshot.location && (
                    <p>
                      <span className="text-[#747B76]">Location:</span>{' '}
                      {submittedSnapshot.location}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href={buildMailtoHref(submittedSnapshot)}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#00C52B] hover:bg-[#008F24] text-[#121D39] hover:text-white font-display font-bold text-xs tracking-[0.09em] uppercase transition-colors whitespace-nowrap"
                  >
                    <Send className="w-4 h-4" aria-hidden="true" />
                    <span>Send via Your Email App</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-3.5 border border-[#192647]/25 hover:border-[#192647] text-[#192647] font-display font-semibold text-xs tracking-[0.09em] uppercase transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Prepare Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                aria-label="Request a landscape consultation"
                className="space-y-6"
              >
                <div className="border-b border-[#DCE2DC] pb-4 mb-2 flex items-baseline justify-between gap-4">
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-[#192647]">
                    Consultation Request
                  </h3>
                  <span className="text-xs text-[#747B76]">* Required fields</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* 1. Full Name — required */}
                  <div>
                    <label
                      htmlFor="contact-full-name"
                      className="block text-xs font-semibold tracking-[0.12em] uppercase text-[#192647] mb-2"
                    >
                      Full Name <span className="text-[#008F24]">*</span>
                    </label>
                    <input
                      id="contact-full-name"
                      name="fullName"
                      type="text"
                      required
                      autoComplete="name"
                      value={values.fullName}
                      onChange={(e) => {
                        setValues((v) => ({ ...v, fullName: e.target.value }));
                        if (errors.fullName) {
                          setErrors((er) => ({ ...er, fullName: undefined }));
                        }
                      }}
                      aria-invalid={Boolean(errors.fullName)}
                      aria-describedby={
                        errors.fullName ? 'error-full-name' : undefined
                      }
                      placeholder="Your full name"
                      className={`w-full bg-white border px-4 py-3.5 text-[15px] text-[#242824] placeholder:text-[#747B76]/70 focus:outline-none focus:border-[#00C52B] transition-colors ${
                        errors.fullName ? 'border-red-600' : 'border-[#D4DCD4]'
                      }`}
                    />
                    {errors.fullName && (
                      <p
                        id="error-full-name"
                        role="alert"
                        className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-red-700 font-medium"
                      >
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  {/* 2. Email Address — required */}
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-semibold tracking-[0.12em] uppercase text-[#192647] mb-2"
                    >
                      Email Address <span className="text-[#008F24]">*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={values.email}
                      onChange={(e) => {
                        setValues((v) => ({ ...v, email: e.target.value }));
                        if (errors.email) {
                          setErrors((er) => ({ ...er, email: undefined }));
                        }
                      }}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'error-email' : undefined}
                      placeholder="name@example.com"
                      className={`w-full bg-white border px-4 py-3.5 text-[15px] text-[#242824] placeholder:text-[#747B76]/70 focus:outline-none focus:border-[#00C52B] transition-colors ${
                        errors.email ? 'border-red-600' : 'border-[#D4DCD4]'
                      }`}
                    />
                    {errors.email && (
                      <p
                        id="error-email"
                        role="alert"
                        className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-red-700 font-medium"
                      >
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* 3. Phone Number — optional */}
                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="block text-xs font-semibold tracking-[0.12em] uppercase text-[#192647] mb-2"
                    >
                      Phone Number{' '}
                      <span className="text-[#747B76] font-normal normal-case tracking-normal">
                        (Optional)
                      </span>
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={values.phone}
                      onChange={(e) => {
                        setValues((v) => ({ ...v, phone: e.target.value }));
                        if (errors.phone) {
                          setErrors((er) => ({ ...er, phone: undefined }));
                        }
                      }}
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? 'error-phone' : undefined}
                      placeholder="905-000-0000"
                      className={`w-full bg-white border px-4 py-3.5 text-[15px] text-[#242824] placeholder:text-[#747B76]/70 focus:outline-none focus:border-[#00C52B] transition-colors ${
                        errors.phone ? 'border-red-600' : 'border-[#D4DCD4]'
                      }`}
                    />
                    {errors.phone && (
                      <p
                        id="error-phone"
                        role="alert"
                        className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-red-700 font-medium"
                      >
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* 4. Property Location — optional */}
                  <div>
                    <label
                      htmlFor="contact-location"
                      className="block text-xs font-semibold tracking-[0.12em] uppercase text-[#192647] mb-2"
                    >
                      Property Location{' '}
                      <span className="text-[#747B76] font-normal normal-case tracking-normal">
                        (Optional)
                      </span>
                    </label>
                    <input
                      id="contact-location"
                      name="location"
                      type="text"
                      value={values.location}
                      onChange={(e) =>
                        setValues((v) => ({ ...v, location: e.target.value }))
                      }
                      placeholder="e.g., Stouffville, Toronto, Aurora"
                      className="w-full bg-white border border-[#D4DCD4] px-4 py-3.5 text-[15px] text-[#242824] placeholder:text-[#747B76]/70 focus:outline-none focus:border-[#00C52B] transition-colors"
                    />
                  </div>
                </div>

                {/* 5. Type of Project — dropdown */}
                <div>
                  <label
                    htmlFor="contact-project-type"
                    className="block text-xs font-semibold tracking-[0.12em] uppercase text-[#192647] mb-2"
                  >
                    Type of Project
                  </label>
                  <select
                    id="contact-project-type"
                    name="projectType"
                    value={values.projectType}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, projectType: e.target.value }))
                    }
                    className="w-full bg-white border border-[#D4DCD4] px-4 py-3.5 text-[15px] text-[#242824] focus:outline-none focus:border-[#00C52B] transition-colors cursor-pointer"
                  >
                    {PROJECT_TYPE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 6. Tell Us About Your Project — optional */}
                <div>
                  <label
                    htmlFor="contact-details"
                    className="block text-xs font-semibold tracking-[0.12em] uppercase text-[#192647] mb-2"
                  >
                    Tell Us About Your Project{' '}
                    <span className="text-[#747B76] font-normal normal-case tracking-normal">
                      (Optional)
                    </span>
                  </label>
                  <textarea
                    id="contact-details"
                    name="details"
                    rows={4}
                    value={values.details}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, details: e.target.value }))
                    }
                    placeholder="Share your vision, outdoor living goals, stonework or planting priorities..."
                    className="w-full bg-white border border-[#D4DCD4] px-4 py-3.5 text-[15px] text-[#242824] placeholder:text-[#747B76]/70 focus:outline-none focus:border-[#00C52B] transition-colors resize-y"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#00C52B] hover:bg-[#008F24] disabled:opacity-65 text-[#121D39] hover:text-white font-display font-bold text-xs sm:text-sm tracking-[0.09em] uppercase transition-colors duration-200 cursor-pointer whitespace-nowrap"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        <span>Preparing Request...</span>
                      </>
                    ) : (
                      <span>Request a Consultation</span>
                    )}
                  </button>

                  <p className="text-xs text-[#747B76] max-w-xs leading-relaxed">
                    Front-end demo interface · Connect your production form
                    endpoint before live deployment.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
