import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t bg-card">
      <div className="container mx-auto px-4 py-8 text-center md:px-6">
        <div className="mx-auto max-w-3xl">
          <h3 className="font-semibold text-foreground">Disclaimer</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            MindAura is an AI-powered chatbot and not a licensed therapist or a
            substitute for professional mental health care. If you are
            experiencing distress or crisis, please contact your local mental
            health helpline or emergency services.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} MindAura. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
