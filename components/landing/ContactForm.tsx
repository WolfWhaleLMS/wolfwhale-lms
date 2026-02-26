'use client'

import { useActionState, useEffect, useRef } from 'react'
import { Send } from 'lucide-react'
import { toast } from 'sonner'
import { submitContactForm, type ContactFormState } from '@/app/actions/contact'

const initialState: ContactFormState = { success: false }

const inputClasses = "w-full h-11 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#00BFFF]/30 focus:border-[#00BFFF]/50 transition-all"

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) {
      toast.success('Message sent! We\'ll get back to you within 1-2 business days.')
      formRef.current?.reset()
    } else if (state.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="space-y-4 sm:space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label htmlFor="contact-name" className="block text-xs text-gray-500 dark:text-white/60 uppercase tracking-wider mb-1.5 font-medium">
            Name <span className="text-red-400">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            placeholder="Your full name"
            className={inputClasses}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="contact-email" className="block text-xs text-gray-500 dark:text-white/60 uppercase tracking-wider mb-1.5 font-medium">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="you@school.ca"
            className={inputClasses}
          />
        </div>

        {/* School */}
        <div>
          <label htmlFor="contact-school" className="block text-xs text-gray-500 dark:text-white/60 uppercase tracking-wider mb-1.5 font-medium">
            School / Institution
          </label>
          <input
            id="contact-school"
            name="school"
            type="text"
            placeholder="e.g. Vancouver School Board"
            className={inputClasses}
          />
        </div>

        {/* Role */}
        <div>
          <label htmlFor="contact-role" className="block text-xs text-gray-500 dark:text-white/60 uppercase tracking-wider mb-1.5 font-medium">
            Your Role
          </label>
          <select
            id="contact-role"
            name="role"
            defaultValue=""
            className={`${inputClasses} appearance-none`}
          >
            <option value="" disabled className="bg-white dark:bg-black text-gray-400 dark:text-white/50">Select your role</option>
            <option value="teacher" className="bg-white dark:bg-black text-gray-900 dark:text-white">Teacher</option>
            <option value="administrator" className="bg-white dark:bg-black text-gray-900 dark:text-white">Administrator</option>
            <option value="it-director" className="bg-white dark:bg-black text-gray-900 dark:text-white">IT Director</option>
            <option value="parent" className="bg-white dark:bg-black text-gray-900 dark:text-white">Parent</option>
            <option value="other" className="bg-white dark:bg-black text-gray-900 dark:text-white">Other</option>
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className="block text-xs text-gray-500 dark:text-white/60 uppercase tracking-wider mb-1.5 font-medium">
          Message <span className="text-red-400">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          placeholder="Tell us about your school and what you're looking for..."
          className="w-full rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#00BFFF]/30 focus:border-[#00BFFF]/50 transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl btn-chrome-3d-dark text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            Send Message
          </>
        )}
      </button>
    </form>
  )
}
