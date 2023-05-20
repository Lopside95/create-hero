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
  // heroes are then submitted and saved within the team state
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
    chosenAttribute: "None",
    chosenBoots: "None",
    chosenWeapon: "None",
    chosenBonus: "",
  });

  // This useEffect keeps track of, and updates, calculated values as they change through user inputs.
  // These values depend on a variety of interactions between attributes, weapons and boots.

  // Trying to declare submitEffect as a const varialble wasn't working

  let [submitEffect, setSubmitEffect] = useState(false);

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
      name: "None",
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
      name: "None",
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
      name: "None",
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

  const bootsIcon = (
    <img className="boots icon" src="./boot-outline.png" alt="" />
  );

  const weaponIcon = (
    <img className="weapon icon" src="./weapon-icon.png" alt="" />
  );

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

  // These states hold the calculated values of totalHealth etc.
  // based on the user/form selections
  const [totalHealth, setTotalHealth] = useState(0);

  const [totalDamage, setTotalDamage] = useState(0);

  const [totalMana, setTotalMana] = useState(0);

  const [totalAttackSpeed, setTotalAttackSpeed] = useState(0);

  const [totalMoveSpeed, setTotalMoveSpeed] = useState(0);

  // This changes the colour of e.g. a border / text or some other kind of
  // visual effect based on which attribute is selected
  // Not currently in use*
  const attrChangeColor = () => {
    if (heroes.chosenAttribute === "Strength") {
      return "#c30000";
    } else if (heroes.chosenAttribute === "Agility") {
      return "#33b107";
    } else if (heroes.chosenAttribute === "Intelligence") {
      return "#0831c2";
    } else {
    }
  };

  // also not in use*
  const attrTextColors = {
    color: attrChangeColor(),
    // border: `1px solid ${attrChangeColor()}`,
  };

  // this element maps over the information in boots state to render the different options
  // added ternaries to avoid unused/blank bullet points
  const bootsElements = boots.map((boot) => (
    <ul className="boots-elements" key={boot.id}>
      <h4>{boot.name}</h4>
      <li>Move speed: {boot.moveSpeed}</li>
      {boot.damage && boot.damage > 0 ? <li>Damage: {boot.damage}</li> : ""}
      {boot.attackSpeed && boot.attackSpeed > 0 ? (
        <li>Attack Speed: {boot.attackSpeed}</li>
      ) : (
        ""
      )}

      {boot.name === "Power Treads" ? (
        <li>+ {boot.bonus} Attribute = +10 attribute bonus and +10 damage</li>
      ) : (
        <li>{boot.bonus}</li>
      )}
    </ul>
  ));

  // works the same way as bootElements
  const weaponsElements = weapons.map((weapon) => (
    <ul className="weapons-elements">
      <h4>{weapon.name}</h4>
      <li>Damage: {weapon.damage}</li>
      <li>Type: {weapon.damageType}</li>
      {weapon.attackSpeed && weapon.attackSpeed > 0 ? (
        <li>Attack Speed: {weapon.attackSpeed}</li>
      ) : (
        ""
      )}
      {weapon.mana && weapon.mana > 0 ? <li>Mana: {weapon.mana}</li> : ""}
      <li>{weapon.bonus}</li>
    </ul>
  ));

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
  const weaponForDisplay = heroSelections().selectedWeapon;
  const bootsForDisplay = heroSelections().selectedBoots;
  const attributeForDisplay = heroSelections().selectedAttribute;

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
      chosenAttribute: "None",
      chosenBoots: "None",
      chosenWeapon: "None",
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
        <h5>{`Health = ${team.totalHealth}`}</h5>
        <h5>{`Mana = ${team.totalMana}`}</h5>
        <h5>{`Damage = ${team.totalDamage}`}</h5>
        <h5>{`Attack Speed = ${team.totalAttackSpeed}`}</h5>
        <h5>{`Move Speed = ${team.totalMoveSpeed}`}</h5>
      </div>
    );
  }

  window.addEventListener("click", function () {
    submitEffect === true && setSubmitEffect(false);
  });

  return (
    <div className="random-hero">
      <Container>
        <Row className="header">
          {/* I think maybe I've made too many/unnecessary classes?
          and also they need to be standardised more */}
          <Col className="intro">
            <h4 className="intro-header">How To Play</h4>
            <p className="intro-text">
              Select attributes and items from the menu to create a hero. Submit
              them and save them to your team, which will consist of 3 heroes.
              <br />
              Items and attributes interact with each other differently and
              grant various bonuses. Keep these in mind when assembling your
              team.
            </p>
          </Col>

          <label htmlFor="build-hero" className="form-header">
            <h5>Choose a name</h5>
          </label>
        </Row>
        <Row className="main">
          {/* Can't figure out how to get the radion buttons to line up with the
            text */}
          <Col className="all-menus">
            {/* The form consists of text and radio inputs 
            These text inputs  allow users to give their hero a name*/}
            <form className="form" onSubmit={submitHero}>
              <input
                className="first name"
                type="text"
                placeholder="First name . . ."
                name="firstName"
                value={heroes.firstName}
                onChange={handleChange}
              />
              <input
                className="last name"
                type="text"
                placeholder="Last name . . ."
                name="lastName"
                value={heroes.lastName}
                onChange={handleChange}
              />
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
                      {/* <h5>{attribute.name}</h5> */}
                      {/* <p>{attribute.effect}</p> */}
                    </label>
                  ))}
                </Col>
              </Row>

              <br />
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
              <br />
              <button className="submit-button" type="submit" value="Submit">
                Submit
              </button>
            </form>
          </Col>
          <Col className="displays">
            <Row className="submit-effect">
              {submitEffect === true && (
                <div>
                  <h1 className="submitted-text">HERO SAVED</h1>
                </div>
              )}
            </Row>

            <Row className="attributes-display-row">
              {heroes.chosenAttribute !== "None" ? (
                <div className="attributes-display-list">
                  {heroes.chosenAttribute === "Strength" && (
                    <ul>
                      <span className="strength-word">Strength</span>
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
                    <p>
                      <span className="agility-word">Agility </span>
                      increases your hero’s attack speed
                    </p>
                  )}
                  {heroes.chosenAttribute === "Intelligence" && (
                    <p>
                      <span className="intelligence-word"> Intelligence</span>{" "}
                      increases your hero’s maximum mana pool.
                    </p>
                  )}
                </div>
              ) : (
                "Select an attribute"
              )}
            </Row>
            {/* Using 'bootsForDisplay' because trying to select using
            'heroes.chosenBoots.attackSpeed etc wasn't working */}
            <Row className="boots-display-row">
              {heroes.chosenBoots !== "None" ? (
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
                    <li>+ {bootsForDisplay.bonus} attribute points</li>
                  ) : (
                    <li>{bootsForDisplay.bonus}</li>
                  )}
                </ul>
              ) : (
                "Select boots"
              )}
            </Row>
            <Row className="weapons-display-row">
              {heroes.chosenWeapon !== "None" ? (
                <ul className="weapons-display-list">
                  <h5>{weaponForDisplay.name}</h5>
                  <li>Damage: {weaponForDisplay.damage}</li>
                  <li>{weaponForDisplay.damageType}</li>
                  {weaponForDisplay.attackSpeed > 0 && (
                    <li>Attack Speed: {weaponForDisplay.attackSpeed}</li>
                  )}
                  {weaponForDisplay.mana > 0 && (
                    <li>Mana: {weaponForDisplay.mana}</li>
                  )}
                  <li>{weaponForDisplay.bonus}</li>
                </ul>
              ) : (
                "select a weapon"
              )}
            </Row>
          </Col>
          {/* Live preview renders the selected items and calculated values before submit */}
          {/* I've put the preview in the middle- vertically- of the page so that
          the preview is visible{" "} */}

          <Col className="live-preview">
            <Row></Row>

            <Row>
              <InputsPreview />
              <CalculationsPreview />
            </Row>
          </Col>
        </Row>
        <Row>
          <Col className="team-heroes">{teamMembers}</Col>
        </Row>
        <br />
        <br />
      </Container>
    </div>
  );
}

export default App;
