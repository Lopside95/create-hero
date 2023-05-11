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
    chosenAttribute: "",
    chosenBoots: "",
    chosenArmor: "",
    chosenWeapon: "",
    chosenBonus: "",
  });

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
      damage: 60,
      damageType: "Magical",
      attackSpeed: 10,
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
    <img className="boots-icon" src="./boot-outline.png" alt="" />
  );

  const weaponIcon = (
    <img className="weapon-icon" src="./weapon-icon.png" alt="" />
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
  // Not currently in use but they hex values are used by the css for the intro text
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

  const attrTextColors = {
    color: attrChangeColor(),
    // border: `1px solid ${attrChangeColor()}`,
  };

  // this element maps over the information in boots state to render the different options
  // added ternaries to avoid unused/blank bullet points
  const bootElements = boots.map((boot) => (
    <ul className="boot-elements" key={boot.id}>
      <h4>{boot.name}</h4>
      <li>Move speed: {boot.moveSpeed}</li>
      {boot.damage && boot.damage > 0 ? <li>Damage: {boot.damage}</li> : ""}
      {boot.attackSpeed && boot.attackSpeed > 0 ? (
        <li>Attack Speed: {boot.attackSpeed}</li>
      ) : (
        ""
      )}

      {boot.name === "Power Treads" ? (
        <li>
          + {boot.bonus} Primary attribute = +10 attribute bonus and +10 damage
        </li>
      ) : (
        <li>{boot.bonus}</li>
      )}
    </ul>
  ));

  // works the same way as bootsElements
  const weaponsElements = weapons.map((weapon) => (
    <ul className="weapons-stats">
      <h4>{weapon.name}</h4>
      <li>Damage: {weapon.damage}</li>
      <li>Type: {weapon.damageType}</li>
      {weapon.attackSpeed && weapon.attackSpeed > 0 ? (
        <li>Attack Speed: {weapon.attackSpeed}</li>
      ) : (
        ""
      )}
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
        <h3>{`Name: ${heroes.firstName} ${heroes.lastName}`}</h3>
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

  function ResultsPreview() {
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
      chosenAttribute: "",
      chosenBoots: "",
      chosenArmor: "",
      chosenWeapon: "",
      chosenBonus: "",
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
      }
    };

    // This returns the input name(s), attributes, items and calculations and
    // and saves them within the [teams] state
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
          <img className="weapon icon" src="./weapon-icon.png" alt="" />
        </div>
        <h5>{`Health = ${team.totalHealth}`}</h5>
        <h5>{`Mana = ${team.totalMana}`}</h5>
        <h5>{`Damage = ${team.totalDamage}`}</h5>
        <h5>{`Attack Speed = ${team.totalAttackSpeed}`}</h5>
        <h5>{`Move Speed = ${team.totalMoveSpeed}`}</h5>
      </div>
    );
  }

  return (
    <div className="random-hero">
      <Container>
        <Row className="header">
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
          <Col className="attr-info">
            <h4 className="attr-heading">Attributes</h4>
            <p className="attr-text">
              There are 3 different attributes to choose from, each with their
              own bonuses. <span className="strength">Strength</span> increases
              your hero’s maximum health,
              <span className="agility">Agility</span> increases your hero’s
              attack speed and
              <span className="intelligence">Intelligence</span> increases your
              hero’s maximum mana pool.
              <br />
              Each attribute point increases its corresponding bonus by 1. For
              example, 1 strength point increases health by 1. Similarly, each
              point of a hero’s primary attribute increases their damage by 1.
            </p>
          </Col>
          <label htmlFor="build-hero" className="form-start">
            <h5>Start by choosing a primary attribute</h5>
          </label>
        </Row>
        <Row className="main">
          <Col className="all-menus">
            {/* The form consists of text and radio inputs */}
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

              <Row className="attributes">
                <Col className="attributes-details">
                  {/* This maps the available attribute options and allows for selection */}
                  <h5>Primary Attribute</h5>
                  {attributes.map((attribute) => (
                    <label className="attributes-input" key={attribute.id}>
                      <input
                        type="radio"
                        name="chosenAttribute"
                        value={attribute.name}
                        checked={heroes.chosenAttribute === attribute.name}
                        onChange={handleChange}
                      />
                      <h5>{attribute.name}</h5>
                      <p>+ {attribute.effect}</p>
                    </label>
                  ))}
                </Col>
              </Row>

              <br />
              <br />
              <Row>
                <Col>
                  Maps the
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
              <Row>
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
          <Col className="item-descriptions">
            <Col>
              <Row>{bootElements}</Row>
              <br />
              <Row>{weaponsElements}</Row>
            </Col>
          </Col>

          {/* Live preview renders the selected items and calculated values before submit */}
          <Col className="live-preview">
            <Row>
              <InputsPreview />
              <ResultsPreview />
            </Row>
          </Col>
        </Row>
        <Row>
          <Col className="saved-heroes">{teamMembers}</Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
