import React from 'react'

export default function ConfirmShamingModal({ onAccept, onDecline }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-shaming-title">
      <div className="modal-panel confirm-shaming" data-demo-pattern="confirm_shaming">
        <h3 id="confirm-shaming-title">Would you like to save 20%?</h3>
        <p>Apply an extra 20% off your order right now, before you check out.</p>
        <div className="confirm-shaming-actions">
          <button
            type="button"
            className="btn btn-flare confirm-shaming-yes"
            data-action="accept-discount"
            onClick={onAccept}
          >
            Yes, save 20%
          </button>
          <button
            type="button"
            className="confirm-shaming-no"
            data-action="decline-discount"
            data-pattern="confirm_shaming_decline_text"
            onClick={onDecline}
          >
            No, I don't want to save money
          </button>
        </div>
      </div>
    </div>
  )
}
