import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useEffect } from "react";
import { nanoid } from "nanoid";
import "./App.css";

function App() {
  const [teams, setTeams] = useState([]);

  // inputs are prefixed with 'chosen' or 'base' within the heroes state
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

  useEffect(() => {
    calculateDamage();
    calculateHealth();
    calculateMana();
    calculateAttackSpeed();
    calculateMoveSpeed();
    console.log(heroes);
  }, [heroes]);

  // const [gold, setGold] = useState(100);

  const [boots, setBoots] = useState([
    {
      id: "treads",
      name: "Power Treads",
      moveSpeed: 70,
      attackSpeed: 10,
      damage: 0,
      health: 0,
      bonus: 10,
      // outline: false,
      // attributePoints: 10,
      //treads adds a bonus 10 of whichever attribute is selected
      // and each point of a hero's primary attr increases their damage by 1
      // cost: 12,
    },
    {
      id: "phase",
      name: "Phase Boots",
      moveSpeed: 80,
      attackSpeed: 0,
      damage: 20,
      health: 0,
      bonus: "Phase Shift",
      // outline: false,
      // attributePoints: "",
      // cost: 10,
    },
    {
      id: "tp",
      name: "Boots of Teleportation",
      moveSpeed: 100,
      attackSpeed: 0,
      damage: 0,
      health: 0,
      bonus: "TP to creeps",
      // outline: false,
      // attributePoints: "",
      // cost: 15,
    },
  ]);

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

  const [weapons, setWeapons] = useState([
    {
      id: "daedalus",
      name: "Daedalus",
      damage: 120,
      damageType: "Physical",
      attackSpeed: 0,
      mana: 0,
      // cost: 40,
    },
    {
      id: "aghs",
      name: "Aghanim's Scepter",
      damage: 80,
      damageType: "Magical",
      attackSpeed: 10,
      mana: 15,
      // cost: 30,
    },
    {
      id: "butterfly",
      name: "Butterfly",
      damage: 30,
      damageType: "Physical",
      attackSpeed: 30,
      mana: 0,
      // cost: 38,
    },
  ]);

  const [totalHealth, setTotalHealth] = useState(0);

  const [totalDamage, setTotalDamage] = useState(0);

  const [totalMana, setTotalMana] = useState(0);

  const [totalAttackSpeed, setTotalAttackSpeed] = useState(0);

  const [totalMoveSpeed, setTotalMoveSpeed] = useState(0);

  // added ternaries to avoid unused/blank bullet points

  const attrChangeColor = () => {
    if (heroes.chosenAttribute === "Strength") {
      return "red";
    } else if (heroes.chosenAttribute === "Agility") {
      return "green";
    } else if (heroes.chosenAttribute === "Intelligence") {
      return "blue";
    } else {
      return "white";
    }
  };

  const attrTextColors = {
    color: attrChangeColor(),
    // border: `1px solid ${attrChangeColor()}`,
  };

  const bootStyles = {};

  const bootElements = boots.map((boot) => (
    <ul className="boot-elements" key={boot.id} style={bootStyles}>
      <h4>{boot.name}</h4>
      <li>Move speed: {boot.moveSpeed}</li>
      {boot.damage && boot.damage > 0 ? <li>Damage: {boot.damage}</li> : ""}
      {boot.attackSpeed && boot.attackSpeed > 0 ? (
        <li>Attack Speed: {boot.attackSpeed}</li>
      ) : (
        ""
      )}
      {/* {boot.attributePoints && (
        <li>Attribute Points: {boot.attributePoints}</li>
      )} */}
      {boot.name === "Power Treads" ? (
        <li>+ {boot.bonus} Primary Attribute</li>
      ) : (
        <li>{boot.bonus}</li>
      )}

      {/* {boot.bonus && <li>Bonus: {boot.bonus}</li>} */}
    </ul>
  ));

  const weaponsElements = weapons.map((weapon) => (
    <ul className="weapons-stats">
      <h4>{weapon.name}</h4>
      <li>Damage: {weapon.damage}</li>
      <li>Damage Type: {weapon.damageType}</li>
      {weapon.attackSpeed && weapon.attackSpeed > 0 ? (
        <li>Attack Speed: {weapon.attackSpeed}</li>
      ) : (
        ""
      )}
    </ul>
  ));

  //when being defined with the purpose of calculation, inputs are prefixed with 'selected'

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

  function handleChange(event) {
    const { name, type, value, checked } = event.target;
    setHeroes((prevHeroes) => ({
      ...prevHeroes,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  const calculateDamage = () => {
    const { selectedBoots, selectedWeapon, selectedAttribute } =
      heroSelections();
    const bootsBaseDamage = selectedBoots ? selectedBoots.damage : 0;
    const weaponDamage = selectedWeapon ? selectedWeapon.damage : 0;

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

    setTeams((prevTeams) => [...prevTeams, updatedHero]);
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

  const bootsIcon = (
    <img className="boots-icon" src="./boot-outline.png" alt="" />
  );

  const swordIcon = <img className="sword-icon" src="./SwordIcon.png" alt="" />;

  function SubmittedHero({ team }) {
    return (
      <div className="submitted-hero">
        <h3>{`${team.firstName} ${team.lastName}`}</h3>
        <h4>{team.chosenAttribute}</h4>
        <div className="for-boots">
          <h4>{team.chosenBoots}</h4>
          <img className="boots-icon" src="./boot-outline.png" alt="" />
        </div>
        <h4>{team.chosenWeapon}</h4>
        <h5>{`Health = ${team.totalHealth}`}</h5>
        <h5>{`Mana = ${team.totalMana}`}</h5>
        <h5>{`Damage = ${team.totalDamage}`}</h5>
        <h5>{`Attack Speed = ${team.totalAttackSpeed}`}</h5>
        <h5>{`Move Speed = ${team.totalMoveSpeed}`}</h5>
      </div>
    );
  }

  function InputsPreview() {
    const styles = {
      // backgroundColor: changeColor(),
      color: attrChangeColor(),
    };

    return (
      <div className="display-hero">
        <h3>{`Name: ${heroes.firstName} ${heroes.lastName}`}</h3>
        <br></br>
        {heroes.chosenAttribute ? (
          <h4 style={styles}>{heroes.chosenAttribute}</h4>
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
            {heroes.chosenWeapon} {swordIcon}
          </h4>
        ) : (
          <h4>Weapon</h4>
        )}
        {/* <h4>{`${heroes.chosenAttribute}`}</h4> */}
        {/* <h4>{`${heroes.chosenBoots}`}</h4> */}

        {/* <h4>{`${heroes.chosenWeapon}`}</h4> */}
      </div>
    );
  }

  function ResultsPreview() {
    const styles = {
      // backgroundColor: changeColor(),
      color: attrChangeColor(),
    };

    return (
      <div className="hero-preview">
        <h5
          className="preview-health"
          // style={styles}
        >{`${totalHealth} Health`}</h5>
        <h5>{`${totalMana} Mana`}</h5>
        <h5>{`${totalDamage} Damage`}</h5>
        <h5>{`${totalAttackSpeed} Attack speed`}</h5>
        <h5>{`${totalMoveSpeed} Movement speed`}</h5>
      </div>
    );
  }
  // function ResultsPreview() {
  //   return (
  //     <div className="hero-preview">
  //       <h5>{`Health = ${totalHealth} Health`}</h5>
  //       <h5>{`Mana = ${totalMana} Mana`}</h5>
  //       <h5>{`Damage = ${totalDamage} Damage`}</h5>
  //       <h5>{`Attack Speed = ${totalAttackSpeed} Attack speed`}</h5>
  //       <h5>{`Move Speed = ${totalMoveSpeed} Movement speed`}</h5>
  //     </div>
  //   );
  // }

  return (
    <div className="random-hero">
      <Container>
        <Row className="header">
          <Col>
            Select Attributes and items, keeping in my synergies, to create
            heroes and assemble a team
          </Col>
          <Col></Col>
        </Row>
        <Row className="main">
          <Col className="all-menus">
            <label htmlFor="build-hero">Build a new Hero</label>
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
                  {/* <div className="attr-bullet-points">
                    <p>{attributes.effect}</p>
                  </div> */}
                </Col>
              </Row>

              <br />
              <br />
              <Row>
                <Col>
                  <h5>Boots</h5>
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
              <button
                className="create-hero-button"
                type="submit"
                value="Submit"
              >
                Submit
              </button>
            </form>
          </Col>
          <Col className="item-descriptions">
            <Col>
              <Row>{bootElements}</Row>
              <Row>{weaponsElements}</Row>
            </Col>
          </Col>
          <Col className="live-preview">
            <InputsPreview />
            <ResultsPreview />
            {/* <Row className="saved-heroes">{teamMembers}</Row> */}
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
