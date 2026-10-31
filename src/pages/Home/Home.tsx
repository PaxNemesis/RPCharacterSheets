import { Link } from '@tanstack/react-router'
import './Home.styles.css'

export function Home() {
  return (
    <div className="home-page">
      <h1>RPCharacterSheets</h1>
      <p className="home-intro">
        Fillable character sheets for tabletop roleplaying games. Totals and derived stats fill in as you type, you can
        keep several characters open in tabs, and each character saves to a JSON file you can open again later.
      </p>
      <ul className="home-systems">
        <li>
          <Link to="/iron-kingdoms-fmf" className="home-system">
            <span className="home-system-title">Iron Kingdoms: Full Metal Fantasy</span>
            <span className="home-system-description">Characters, life spiral, skills, gear, spells and steamjacks.</span>
          </Link>
        </li>
        <li>
          <Link to="/fabula-ultima" className="home-system">
            <span className="home-system-title">Fabula Ultima</span>
            <span className="home-system-description">
              Attributes, status effects, Bonds, classes and Skills, equipment, spells and rituals, with the Atlases.
            </span>
          </Link>
        </li>
      </ul>
    </div>
  )
}
