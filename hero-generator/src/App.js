import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useEffect } from "react";
import { nanoid } from "nanoid";
import "./App.css";

function App() {
  const [teams, setTeams] = useState([]);

  // This state stores information based on user selections.
  // heroes are then submitted and saved in the [team] state
  // inputs/future inputs are prefixed with 'chosen' within the heroes state
  const [heroes, setHeroes] = useState({
    id: nanoid(),
    firstName: "",
    lastName: "",
    health: 10,
    mana: 10,
    attackSpeed: 10,
    damage: 10,
    moveSpeed: 30,
    chosenAttribute: "No Attribute",
    chosenBoots: "No Boots",
    chosenWeapon: "No Weapon",
    chosenBonus: "",
  });

  let [submitEffect, setSubmitEffect] = useState(false);

  // This useEffect keeps track of, and updates, calculated values as they change through user inputs.
  // These values depend on a variety of interactions between attributes, weapons and boots.

  useEffect(() => {
    calculateDamage();
    calculateHealth();
    calculateMana();
    calculateAttackSpeed();
    calculateMoveSpeed();
    console.log(heroes);
  }, [heroes]);

  // boots are one of the items (with three options) that a user can choose,
  // each boot object holds information e.g attack speed, which is later used in
  // calculating the hero's total attack speed
  const [boots, setBoots] = useState([
    {
      id: "none",
      name: "No Boots",
      moveSpeed: 0,
      attackSpeed: 0,
      damage: 0,
      health: 0,
      bonus: 0,
    },
    {
      id: "treads",
      name: "Power Treads",
      moveSpeed: 70,
      attackSpeed: 10,
      damage: 0,
      health: 0,
      bonus: 10,
    },
    {
      id: "phase",
      name: "Phase Boots",
      moveSpeed: 80,
      attackSpeed: 0,
      damage: 20,
      health: 0,
      bonus:
        "Phase Shift - move between realms, allowing the hero to attack before their turn",
    },
    {
      id: "tp",
      name: "Boots of Teleportation",
      moveSpeed: 100,
      attackSpeed: 0,
      damage: 0,
      health: 0,
      bonus:
        "Teleport to the other side of an enemy and attack them from behind for an extra 30% damage",
    },
  ]);

  // serves the same function as boots
  const [attributes, setAttributes] = useState([
    {
      id: "none",
      name: "No Attribute",
      effect: "none",
      amount: 0,
    },
    {
      id: "strength",
      name: "Strength",
      effect: " health",
      amount: 10,
    },
    {
      id: "agility",
      name: "Agility",
      effect: " attack speed",
      amount: 10,
    },
    {
      id: "intelligence",
      name: "Intelligence",
      effect: " mana",
      amount: 10,
    },
  ]);

  // serves the same function as boots

  const [weapons, setWeapons] = useState([
    {
      id: "none",
      name: "No Weapon",
      damage: 0,
      damageType: "",
      attackSpeed: 0,
      mana: 0,
      bonus: "",
    },
    {
      id: "daedalus",
      name: "Daedalus",
      damage: 120,
      damageType: "Physical",
      attackSpeed: 0,
      mana: 0,
      bonus: "20% chance to land a critical hit for 130% damage",
    },
    {
      id: "aghs",
      name: "Aghanim's Scepter",
      damage: 50,
      damageType: "Magical",
      attackSpeed: 0,
      mana: 15,
      bonus: "Attack damage increased by 10% of hero's max mana",
    },
    {
      id: "butterfly",
      name: "Butterfly",
      damage: 30,
      damageType: "Physical",
      attackSpeed: 30,
      mana: 0,
      bonus: "15% chance to dodge incoming attacks",
    },
  ]);

  // Which attribute icon to be displayed is conditional and this function returns the appropriate src
  const attrIcon = () => {
    if (heroes.chosenAttribute === "Strength") {
      return <img className="str icon" src="./strength-icon.png" alt="" />;
    } else if (heroes.chosenAttribute === "Agility") {
      return <img className="agi icon" src="./agi-icon.png" alt="" />;
    } else if (heroes.chosenAttribute === "Intelligence") {
      return <img className="int icon" src="./int-icon.png" alt="" />;
    } else {
    }
  };
  const bootsIcon = (
    <img className="boots icon" src="./boot-outline.png" alt="" />
  );

  const weaponIcon = (
    <img className="weapon icon" src="./weapon-icon.png" alt="" />
  );

  // These states hold the calculated values of totalHealth etc.
  // based on the user/form selections
  const [totalHealth, setTotalHealth] = useState(0);

  const [totalMana, setTotalMana] = useState(0);

  const [totalDamage, setTotalDamage] = useState(0);

  const [totalAttackSpeed, setTotalAttackSpeed] = useState(0);

  const [totalMoveSpeed, setTotalMoveSpeed] = useState(0);

  //when being defined with the purpose of calculation, inputs are prefixed with 'selected'

  // This function saves the selectedAttribute, selectedBoots etc in order for them
  // to be referred to in the upcoming calculation functions (e.g. calculateDamage)
  // without having the re-find the selection within each function
  const heroSelections = () => {
    const selectedAttribute = attributes.find(
      (attribute) => attribute.name === heroes.chosenAttribute
    );

    const selectedBoots = boots.find(
      (boot) => boot.name === heroes.chosenBoots
    );

    const selectedWeapon = weapons.find(
      (weapon) => weapon.name === heroes.chosenWeapon
    );
    return {
      selectedAttribute,
      selectedBoots,
      selectedWeapon,
    };
  };

  // using this to select weapons elements to conditionally render
  // unable to refer to 'selectedWeapon' defining the weapon as seen below
  const attributeForDisplay = heroSelections().selectedAttribute;
  const bootsForDisplay = heroSelections().selectedBoots;
  const weaponForDisplay = heroSelections().selectedWeapon;

  // This function handles form inputs. it destructures the variables from the event target
  // and saves the values in the [heroes] state
  function handleChange(event) {
    const { name, type, value, checked } = event.target;
    setHeroes((prevHeroes) => ({
      ...prevHeroes,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // These 'calculate' functions use conditions to calculate totals.
  // there are a number of interactions between items and attributes
  // whereby attributes affect health, damage, mana etc differently/respectively
  // and some items , e.g. power treads, add attribute points meaning that the bonus damage/mana/attack speed
  // they provide must be determined on the condition of which attribute is selected
  const calculateDamage = () => {
    const { selectedBoots, selectedWeapon, selectedAttribute } =
      heroSelections();
    const bootsBaseDamage = selectedBoots ? selectedBoots.damage : 0;
    const weaponDamage = selectedWeapon ? selectedWeapon.damage : 0;

    // as mentioned, boots can inherent damage (phase boots adds 20 dmg) and, in the case of Power Treads,
    // they can increase a hero's attribute which in turn increases their damage by the same amount.
    // the same conditions determine bootsAttributeHealth and so on
    const bootsAttributeDamage =
      selectedAttribute &&
      selectedBoots &&
      selectedBoots.name === "Power Treads"
        ? selectedBoots.bonus
        : 0;

    const calculatedDamage =
      heroes.damage + bootsBaseDamage + weaponDamage + bootsAttributeDamage;
    setTotalDamage(calculatedDamage);
  };

  const calculateHealth = () => {
    const { selectedAttribute, selectedBoots, selectedWeapon } =
      heroSelections();
    const attributeHealth =
      selectedAttribute && selectedAttribute.name === "Strength"
        ? selectedAttribute.amount
        : 0;

    const bootsAttributeHealth =
      selectedAttribute &&
      selectedAttribute.name === "Strength" &&
      selectedBoots &&
      selectedBoots.name === "Power Treads"
        ? selectedBoots.bonus
        : 0;

    const calculatedHealth =
      heroes.health + attributeHealth + bootsAttributeHealth;
    setTotalHealth(calculatedHealth);
  };

  const calculateMana = () => {
    const { selectedAttribute, selectedBoots, selectedWeapon } =
      heroSelections();
    const attributeMana =
      selectedAttribute && selectedAttribute.name === "Intelligence"
        ? selectedAttribute.amount
        : 0;
    const bootsMana =
      selectedBoots && selectedBoots.mana ? selectedBoots.mana : 0;
    const weaponMana = selectedWeapon ? selectedWeapon.mana : 0;

    const bootsAttributeMana =
      selectedAttribute &&
      selectedAttribute.name === "Intelligence" &&
      selectedBoots &&
      selectedBoots.name === "Power Treads"
        ? selectedBoots.bonus
        : 0;

    const calculatedMana =
      heroes.mana + attributeMana + bootsMana + weaponMana + bootsAttributeMana;
    setTotalMana(calculatedMana);
  };

  const calculateAttackSpeed = () => {
    const { selectedAttribute, selectedBoots, selectedWeapon } =
      heroSelections();
    const attributeAttackSpeed =
      selectedAttribute && selectedAttribute.name === "Agility"
        ? selectedAttribute.amount
        : 0;

    const bootsAttributeAttackSpeed =
      selectedAttribute &&
      selectedAttribute.name === "Agility" &&
      selectedBoots &&
      selectedBoots.name === "Power Treads"
        ? selectedBoots.bonus
        : 0;

    const bootsAttackSpeed = selectedBoots ? selectedBoots.attackSpeed : 0;
    const weaponAttackSpeed = selectedWeapon ? selectedWeapon.attackSpeed : 0;
    const calculatedAttackSpeed =
      heroes.attackSpeed +
      attributeAttackSpeed +
      bootsAttributeAttackSpeed +
      bootsAttackSpeed +
      weaponAttackSpeed;
    setTotalAttackSpeed(calculatedAttackSpeed);
  };

  const calculateMoveSpeed = () => {
    const { selectedBoots } = heroSelections();
    const bootsMoveSpeed = selectedBoots ? selectedBoots.moveSpeed : 0;

    const calculatedMoveSpeed = heroes.moveSpeed + bootsMoveSpeed;
    setTotalMoveSpeed(calculatedMoveSpeed);
  };

  // Renders alongside the following ResultsPreview to provide users with a chance to see/play around
  // with their inputs and desired damage/attack speed etc before saving them to the [teams] state
  function InputsPreview() {
    return (
      <div className="inputs-preview">
        <h3 className="preview-name">{`Name: ${heroes.firstName} ${heroes.lastName}`}</h3>
        <br></br>
        {heroes.chosenAttribute ? (
          <h4>
            {heroes.chosenAttribute} {attrIcon()}
          </h4>
        ) : (
          <h4>Attribute</h4>
        )}

        {heroes.chosenBoots ? (
          <h4>
            {heroes.chosenBoots}
            {bootsIcon}
          </h4>
        ) : (
          <h4>Boots</h4>
        )}
        {heroes.chosenWeapon ? (
          <h4>
            {heroes.chosenWeapon} {weaponIcon}
          </h4>
        ) : (
          <h4>Weapon</h4>
        )}
      </div>
    );
  }

  function CalculationsPreview() {
    return (
      <div className="hero-preview">
        <h5 className="preview-health">{`${totalHealth} Health`}</h5>
        <h5>{`${totalMana} Mana`}</h5>
        <h5>{`${totalDamage} Damage`}</h5>
        <h5>{`${totalAttackSpeed} Attack speed`}</h5>
        <h5>{`${totalMoveSpeed} Movement speed`}</h5>
      </div>
    );
  }

  function submitHero(event) {
    event.preventDefault();
    calculateHealth();
    calculateDamage();
    calculateAttackSpeed();
    calculateHealth();
    calculateMana();

    const updatedHero = {
      ...heroes,
      totalHealth,
      totalAttackSpeed,
      totalMana,
      totalDamage,
      totalMoveSpeed,
    };

    // This sets the team to keep any previous heroes saved in the state and adds the new submitted hero
    setTeams((prevTeams) => [...prevTeams, updatedHero]);
    setSubmitEffect(true);

    // This sets the form input back to default after submission
    setHeroes({
      id: nanoid(),
      firstName: "",
      lastName: "",
      health: 10,
      mana: 10,
      attackSpeed: 10,
      damage: 10,
      moveSpeed: 30,
      chosenAttribute: "No Attribute",
      chosenBoots: "No Boots",
      chosenWeapon: "No Weapon",
    });
  }

  const teamMembers = teams.map((team) => (
    <SubmittedHero team={team} key={team.id} />
  ));

  function SubmittedHero({ team }) {
    // attrIcon function is reused within the SubmittedHero function in order for it to be saved
    // previously the icon wouldn't be saved in the submitted hero and then when new selections
    // were made on the form the submittedh hero's attr icon would change according to current inputs
    const teamAttrIcon = () => {
      if (team.chosenAttribute === "Strength") {
        return <img className="str icon" src="./strength-icon.png" alt="" />;
      } else if (team.chosenAttribute === "Agility") {
        return <img className="agi icon" src="./agi-icon.png" alt="" />;
      } else if (team.chosenAttribute === "Intelligence") {
        return <img className="int icon" src="./int-icon.png" alt="" />;
      } else {
        return <img className="blank icon" src="./blank-icon.png" alt="" />;
      }
    };

    // the lastName option/input was removed but the || logic remains in place
    // for potential future use

    return (
      <div className="submitted-hero">
        <h3>
          {team.firstName || team.lastName
            ? `${team.firstName} ${team.lastName}`
            : `Nameless`}
        </h3>
        <div className="subbed-attr">
          <h4>{team.chosenAttribute}</h4>
          {teamAttrIcon()}
        </div>
        <div className="subbed-boots">
          <h4>{team.chosenBoots}</h4>
          <img className="subbed-boots icon" src="./boot-outline.png" alt="" />
        </div>
        <div className="subbed-weapon">
          <h4>{team.chosenWeapon}</h4>
          <img className="subbed-weapon icon" src="./weapon-icon.png" alt="" />
        </div>
        <h5>{`${team.totalHealth} Health`}</h5>
        <h5>{`${team.totalMana} Mana`}</h5>
        <h5>{`${team.totalDamage} Damage`}</h5>
        <h5>{`${team.totalAttackSpeed} Attack Speed`}</h5>
        <h5>{`${team.totalMoveSpeed} Move Speed`}</h5>
      </div>
    );
  }

  window.addEventListener("click", function () {
    submitEffect === true && setSubmitEffect(false);
  });

  return (
    <div className="app-body">
      <Container>
        <Row className="header">
          <Col className="intro">
            <h2 className="intro-header">How To Play</h2>
            <p className="intro-text">
              Select attributes and items from the menu to create a hero. Submit
              them and save them to your team.
              <br />
              Items and attributes interact with each other differently and
              grant various bonuses. Keep these in mind when assembling your
              team.
            </p>
            <p>Saved heroes appear at the bottom of the screen.</p>
          </Col>

          <label htmlFor="build-hero" className="form-header"></label>
        </Row>
        <Row className="main">
          <Col className="all-menus">
            {/* The form consists of text and radio inputs 
            These text inputs  allow users to give their hero a name*/}
            <form className="form" onSubmit={submitHero}>
              <input
                className="name"
                type="text"
                placeholder="Name . . ."
                name="firstName"
                value={heroes.firstName}
                onChange={handleChange}
              />

              <button className="save-button" type="submit" value="Submit">
                Save
              </button>

              <br />
              <br />
              <Row className="attributes-menu">
                <Col>
                  {/* This maps the available attribute options and allows for selection */}
                  <h5>Attribute</h5>
                  {attributes.map((attribute) => (
                    <label className="attributes-input" key={attribute.id}>
                      <input
                        type="radio"
                        name="chosenAttribute"
                        value={attribute.name}
                        checked={heroes.chosenAttribute === attribute.name}
                        onChange={handleChange}
                      />
                      {attribute.name}
                    </label>
                  ))}
                </Col>
              </Row>

              <br />
              <Row className="boots-menu">
                <Col>
                  <h5>Boots</h5>
                  {/* This maps the available boot options and allows for selection */}
                  {boots.map((boot) => (
                    <label className="boots-input" key={boot.id}>
                      <input
                        type="radio"
                        name="chosenBoots"
                        value={boot.name}
                        checked={heroes.chosenBoots === boot.name}
                        onChange={handleChange}
                      />
                      {boot.name}
                    </label>
                  ))}
                </Col>
              </Row>
              <br />
              <Row className="weapons-menu">
                <Col>
                  <h5>Weapons</h5>
                  {/* This maps the available weapon options and allows for selection */}
                  {weapons.map((weapon) => (
                    <label className="weapons-input" key={weapon.id}>
                      <input
                        type="radio"
                        name="chosenWeapon"
                        value={weapon.name}
                        checked={heroes.chosenWeapon === weapon.name}
                        onChange={handleChange}
                      />
                      {weapon.name}
                    </label>
                  ))}
                </Col>
              </Row>
              <br />
            </form>
          </Col>
          <Col className="displays">
            <Row className="submit-effect">
              {submitEffect === true && (
                <h1
                  className="hero-saved"
                  onClick={() => {
                    window.scrollTo({
                      top: document.documentElement.scrollHeight,
                      behavior: "smooth",
                    });
                  }}
                >
                  HERO SAVED
                </h1>
              )}
            </Row>

            {/* This Row conditionally renders the attribute information
          based on the current selection */}
            <Row className="attributes-display-row">
              {heroes.chosenAttribute !== "No Attribute" ? (
                <div className="attr-list-div">
                  {heroes.chosenAttribute === "Strength" && (
                    <ul className="attributes-display-list">
                      <h5 className="strength-word">Strength</h5>
                      <li>
                        Each point of strength increases your hero’s maximum
                        health by 1.
                      </li>
                      <li>
                        Each attribute point also increases your hero’s damage
                        by 1.
                      </li>
                    </ul>
                  )}
                  {heroes.chosenAttribute === "Agility" && (
                    <ul className="attributes-display-list">
                      <h5 className="agility-word">Agility</h5>
                      <li>
                        Each point of agility increases your hero’s maximum
                        attack speed by 1.
                      </li>
                      <li>
                        Each attribute point also increases your hero’s damage
                        by 1.
                      </li>
                    </ul>
                  )}
                  {heroes.chosenAttribute === "Intelligence" && (
                    <ul className="attributes-display-list">
                      <h5 className="intelligence-word">Intelligence</h5>
                      <li>
                        Each point of intelligence increases your hero’s maximum
                        mana pool by 1.
                      </li>
                      <li>
                        Each attribute point also increases your hero’s damage
                        by 1.
                      </li>
                    </ul>
                  )}
                </div>
              ) : (
                <h3 className="select-text attribute">Select Attribute</h3>
              )}
            </Row>

            {/* This conditionally renders the boots information */}
            <Row className="boots-display-row">
              {heroes.chosenBoots !== "No Boots" ? (
                <ul className="boots-display-list">
                  <h5>{bootsForDisplay.name}</h5>
                  <li>Move Speed: {bootsForDisplay.moveSpeed}</li>
                  {bootsForDisplay.attackSpeed > 0 && (
                    <li>Attack Speed: {bootsForDisplay.attackSpeed}</li>
                  )}
                  {bootsForDisplay.damage > 0 && (
                    <li>Damage: {bootsForDisplay.damage}</li>
                  )}
                  {bootsForDisplay.name === "Power Treads" ? (
                    <li>Bonus: + {bootsForDisplay.bonus} attribute points</li>
                  ) : (
                    <li>Bonus: {bootsForDisplay.bonus}</li>
                  )}
                </ul>
              ) : (
                <h3 className="select-text boots">Select Boots</h3>
              )}
            </Row>
            {/* This conditionally renders the weapons information */}
            <Row className="weapons-display-row">
              {heroes.chosenWeapon !== "No Weapon" ? (
                <ul className="weapons-display-list">
                  <h5>{weaponForDisplay.name}</h5>
                  <li>Damage: {weaponForDisplay.damage}</li>
                  <li>Damage Type: {weaponForDisplay.damageType}</li>
                  {weaponForDisplay.attackSpeed > 0 && (
                    <li>Attack Speed: {weaponForDisplay.attackSpeed}</li>
                  )}
                  {weaponForDisplay.mana > 0 && (
                    <li>Mana: {weaponForDisplay.mana}</li>
                  )}
                  <li>Bonus: {weaponForDisplay.bonus}</li>
                </ul>
              ) : (
                <h3 className="select-text weapon">Select Weapon</h3>
              )}
            </Row>
          </Col>
          {/* Live preview renders the selected items and calculated values before submit */}

          <Col className="live-preview">
            <Row>
              <InputsPreview />
              <CalculationsPreview />
            </Row>
          </Col>
        </Row>
        <Row className="team-row">
          <h3 className="team-heading">Your Team</h3>
          <Col className="team-heroes">{teamMembers}</Col>
        </Row>
        <br />
        <br />
      </Container>
    </div>
  );
}

export default App;
