import React from 'react'
import { Link } from 'react-router-dom'
import { useDemo } from '../context/DemoContext'

const SCENARIO_LABELS = {
  falseUrgency: ['False Urgency', 'Countdown timer that resets instead of expiring.'],
  scarcity: ['Scarcity', '"Only N left" and viewer counts that shrink on interaction.'],
  dripPricing: ['Drip Pricing', 'Fees revealed step-by-step during checkout.'],
  preselectedAddon: ['Preselected Add-on', 'Premium Protection checked by default.'],
  confirmShaming: ['Confirm Shaming', 'Guilt-worded decline option on a discount popup.'],
  cancellationObstruction: ['Cancellation Obstruction', 'Multi-step retention flow before cancelling.'],
  visualMisdirection: ['Visual Misdirection', 'Unbalanced emphasis between two competing CTAs.'],
  socialProof: ['Social Proof', 'Synthetic "people viewing" and purchase activity.'],
}

export default function DemoPanel() {
  const { scenarios, toggleScenario, setAllScenarios, resetDemo } = useDemo()

  return (
    <div className="container demo-panel-page">
      <div className="demo-panel-header">
        <h1>Demo Scenarios</h1>
        <p>
          Toggle individual dark-pattern scenarios on or off for a ClauseGuard demo run. This
          panel is for presenters only and is not part of the normal shopping experience.
        </p>
      </div>

      <div className="demo-panel-toolbar">
        <button type="button" className="btn btn-primary" onClick={() => setAllScenarios(true)}>
          Enable All Demo Scenarios
        </button>
        <button type="button" className="btn btn-ghost" onClick={resetDemo}>
          Reset Demo
        </button>
      </div>

      <div className="demo-panel-list">
        {Object.entries(SCENARIO_LABELS).map(([key, [label, description]]) => (
          <label key={key} className="demo-panel-item card">
            <input
              type="checkbox"
              checked={scenarios[key]}
              onChange={() => toggleScenario(key)}
              data-demo-toggle={key}
            />
            <span>
              <strong>{label}</strong>
              <br />
              <small>{description}</small>
            </span>
          </label>
        ))}
      </div>

      <Link to="/" className="btn-quiet demo-panel-back">
        ← Back to store
      </Link>
    </div>
  )
}
