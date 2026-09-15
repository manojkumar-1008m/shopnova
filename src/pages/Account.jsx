import React, { useState } from 'react'
import { useDemo } from '../context/DemoContext'

const CANCEL_STEPS = {
  CONFIRM: 'confirm',
  RETENTION_1: 'retention_1',
  RETENTION_2: 'retention_2',
  FINAL_CONFIRM: 'final_confirm',
}

export default function Account() {
  const { membershipStatus, setMembershipStatus, scenarios, pushToast } = useDemo()
  const [cancelStep, setCancelStep] = useState(null)

  function startCancel() {
    setCancelStep(CANCEL_STEPS.CONFIRM)
  }

  function keepMembership() {
    setCancelStep(null)
    pushToast('Membership kept')
  }

  function advance() {
    if (!scenarios.cancellationObstruction) {
      finishCancel()
      return
    }
    if (cancelStep === CANCEL_STEPS.CONFIRM) setCancelStep(CANCEL_STEPS.RETENTION_1)
    else if (cancelStep === CANCEL_STEPS.RETENTION_1) setCancelStep(CANCEL_STEPS.RETENTION_2)
    else if (cancelStep === CANCEL_STEPS.RETENTION_2) setCancelStep(CANCEL_STEPS.FINAL_CONFIRM)
    else finishCancel()
  }

  function finishCancel() {
    setMembershipStatus('cancelled')
    setCancelStep(null)
    pushToast('Membership cancelled')
  }

  return (
    <div className="container account-page">
      <h1>Account</h1>

      <section className="card account-section" data-demo-pattern="cancellation_obstruction">
        <div className="account-section-heading">
          <h2>Premium Membership</h2>
          <span className={`badge ${membershipStatus === 'active' ? 'badge-success' : 'badge-flare'}`}>
            Status: {membershipStatus === 'active' ? 'Active' : 'Cancelled'}
          </span>
        </div>
        <p>Free delivery, early access to deals, and exclusive member pricing.</p>

        {membershipStatus === 'active' && !cancelStep && (
          <div className="account-actions">
            <button type="button" className="btn btn-ghost" data-action="manage-membership">
              Manage Membership
            </button>
            <button type="button" className="btn-quiet" data-action="cancel-subscription" data-pattern="cancellation" onClick={startCancel}>
              Cancel Membership
            </button>
          </div>
        )}

        {cancelStep === CANCEL_STEPS.CONFIRM && (
          <div className="cancel-step" data-demo-pattern="cancellation_step_1">
            <h3>Are you sure?</h3>
            <p>You'll lose free delivery and member pricing immediately.</p>
            <div className="cancel-step-actions">
              <button type="button" className="btn btn-primary" data-action="keep-membership" onClick={keepMembership}>
                Keep my membership
              </button>
              <button type="button" className="btn-quiet" data-action="continue-cancellation" onClick={advance}>
                Continue cancellation
              </button>
            </div>
          </div>
        )}

        {cancelStep === CANCEL_STEPS.RETENTION_1 && (
          <div className="cancel-step" data-demo-pattern="cancellation_retention_offer">
            <h3>Before you leave, here's a special offer.</h3>
            <p>Stay on and get 30% off your next 3 months of Premium Membership.</p>
            <div className="cancel-step-actions">
              <button type="button" className="btn btn-primary" data-action="keep-membership" onClick={keepMembership}>
                Keep my membership
              </button>
              <button type="button" className="btn-quiet" data-action="continue-cancellation" onClick={advance}>
                Continue cancellation
              </button>
            </div>
          </div>
        )}

        {cancelStep === CANCEL_STEPS.RETENTION_2 && (
          <div className="cancel-step" data-demo-pattern="cancellation_retention_offer">
            <h3>One more thing before you go.</h3>
            <p>We can pause your membership for 2 months instead of cancelling. Pick up right where you left off.</p>
            <div className="cancel-step-actions">
              <button type="button" className="btn btn-primary" data-action="keep-membership" onClick={keepMembership}>
                Keep my membership
              </button>
              <button type="button" className="btn-quiet" data-action="continue-cancellation" onClick={advance}>
                Continue cancellation
              </button>
            </div>
          </div>
        )}

        {cancelStep === CANCEL_STEPS.FINAL_CONFIRM && (
          <div className="cancel-step" data-demo-pattern="cancellation_final_confirm">
            <h3>Confirm cancellation</h3>
            <p>This will cancel your Premium Membership at the end of the current billing period.</p>
            <div className="cancel-step-actions">
              <button type="button" className="btn btn-primary" data-action="keep-membership" onClick={keepMembership}>
                Keep my membership
              </button>
              <button type="button" className="btn btn-flare" data-action="confirm-cancellation" onClick={advance}>
                Confirm cancellation
              </button>
            </div>
          </div>
        )}

        {membershipStatus === 'cancelled' && !cancelStep && (
          <p className="cancel-complete">Your membership is cancelled and won't renew.</p>
        )}
      </section>
    </div>
  )
}
