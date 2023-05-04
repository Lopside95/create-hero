import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useEffect } from "react";
import { nanoid } from "nanoid";
import "./App.css";

// some of the ternaries are a bit messy and maybe would be better
// to make them if...else

// make adjusment with herSelections function
// submit func
// set hero stats to totalHelth etc
// remove local storage
// make teams array an empty array
// push updayed hero to teams array

function App() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {}, [teams]);

  function submitHero() {}

  // inputs are prefixed with 'chosen' or 'base' within the heroes state
  const [heroes, setHeroes] = useState({
    id: 1,
    firstName: "",
    lastName: "",
    baseHealth: 10,
    baseMana: 10,
    baseAttackSpeed: 10,
    baseDamage: 10,
    baseMoveSpeed: 30,
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

  const [gold, setGold] = useState(100);

  const [boots, setBoots] = useState([
    {
      id: "treads",
      name: "Power Treads",
      moveSpeed: 70,
      attackSpeed: 10,
      damage: 0,
      health: 0,
      bonus: 10, //treads adds a bonus 10 of whichever attribute is selected
      // and each point of a hero's primary attr increases their damage by 1
      // cost: 12,
      img: "./treads.png",
    },
    {
      id: "phase",
      name: "Phase Boots",
      moveSpeed: 80,
      attackSpeed: 0,
      damage: 20,
      health: 0,
      bonus: "Phase Shift",
      img: "./phase_boots.png",
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
      img: "./phase_boots.png",
      // cost: 15,
    },
  ]);

  const [attributes, setAttributes] = useState([
    // {
    //   id: "empty",
    //   name: "None",
    //   effect: "",
    //   amount: "",
    //   health: "",
    //   moveSpeed: "",
    //   attackSpeed: "",
    //   damage: "",
    // },
    {
      id: "strength",
      name: "Strength",
      effect: "Increases hitpoints",
      amount: 10,
    },
    {
      id: "agility",
      name: "Agility",
      effect: "Increases attack speed",
      amount: 10,
    },
    {
      id: "intelligence",
      name: "Intelligence",
      effect: "Increases mana",
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

  // ESSENTIALLY: should things like damage/bonus just be left out of a boot's state entirely
  // if that boot doesnt have a damage/bonus value

  const bootElements = boots.map((boot) => (
    <ul className="boot-stats" key={boot.id}>
      <h4>{boot.name}</h4>
      {boot.moveSpeed !== "" ? <li>Move Speed: {boot.moveSpeed}</li> : ""}

      {boot.damage && boot.damage > 0 ? <li>Damage: {boot.damage}</li> : ""}
      {boot.attackSpeed && boot.attackSpeed > 0 ? (
        <li>Attack Speed: {boot.attackSpeed}</li>
      ) : (
        ""
      )}

      {boot.bonus !== "" ? <li>Bonus: {boot.bonus}</li> : ""}
      <img className="boot-image" src={boot.img}></img>
    </ul>
  ));

  // previous boot rendering:
  /* {boot.attackSpeed !== "" ? <li>Attack Speed: {boot.attackSpeed}</li> : ""} */
  /* {boot.damage !== "" ? <li>Damage: {boot.damage}</li> : ""} */

  // rendering weapons elements with different conditons

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

  // const weaponsElements = weapons.map((weapon) => (
  //   <ul className="weapon-stats" key={weapon.id}>
  //     <h4>{weapon.name}</h4>
  //     <li>Damage: {weapon.damage}</li>
  //     <li>Damage Type: {weapon.damageType}</li>
  //     {/* <li>Attack Speed: {weapon.attackSpeed}</li> */}
  //     {weapon.attackSpeed > 0 && <li>Attack Speed: {weapon.attackSpeed}</li>}
  //     <li>Mana: {weapon.mana}</li>
  //   </ul>
  // ));

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

  function handleMouseOver() {}

  function handleChange(event) {
    const { name, type, value, checked } = event.target;
    setHeroes((prevHeroes) => ({
      ...prevHeroes,
      [name]: type === "checkbox" ? checked : value,
    }));
    // console.log(heroes);
  }

  // these should probably be if...else for readability?

  const calculateDamage = () => {
    const { selectedBoots, selectedWeapon, selectedAttribute } =
      heroSelections();
    const bootsBaseDamage = selectedBoots ? selectedBoots.damage : 0;
    const weaponDamage = selectedWeapon ? selectedWeapon.damage : 0;

    const bootsAttributeDamage =
      selectedAttribute &&
      selectedAttribute.name !== "None" &&
      selectedBoots &&
      selectedBoots.name === "Power Treads"
        ? selectedBoots.bonus * 1
        : 0;

    const calculatedDamage =
      heroes.baseDamage + bootsBaseDamage + weaponDamage + bootsAttributeDamage;
    setTotalDamage(calculatedDamage);
  };

  const calculateHealth = () => {
    const { selectedAttribute, selectedBoots, selectedWeapon } =
      heroSelections();
    const attributeHealth =
      selectedAttribute && selectedAttribute.name === "Strength"
        ? selectedAttribute.amount * 1
        : 0;

    const bootsAttributeHealth =
      selectedAttribute &&
      selectedAttribute.name === "Strength" &&
      selectedBoots &&
      selectedBoots.name === "Power Treads"
        ? selectedBoots.bonus * 1
        : 0;

    const calculatedHealth =
      heroes.baseHealth + attributeHealth + bootsAttributeHealth;
    setTotalHealth(calculatedHealth);
  };

  const calculateMana = () => {
    const { selectedAttribute, selectedBoots, selectedWeapon } =
      heroSelections();
    const attributeMana =
      selectedAttribute && selectedAttribute.name === "Intelligence"
        ? selectedAttribute.amount * 1
        : 0;
    const bootsMana =
      selectedBoots && selectedBoots.mana ? selectedBoots.mana : 0;
    const weaponMana = selectedWeapon ? selectedWeapon.mana : 0;

    const bootsAttributeMana =
      selectedAttribute &&
      selectedAttribute.name === "Intelligence" &&
      selectedBoots &&
      selectedBoots.name === "Power Treads"
        ? selectedBoots.bonus * 1
        : 0;

    const calculatedMana =
      heroes.baseMana +
      attributeMana +
      bootsMana +
      weaponMana +
      bootsAttributeMana;
    setTotalMana(calculatedMana);
  };

  const calculateAttackSpeed = () => {
    const { selectedAttribute, selectedBoots, selectedWeapon } =
      heroSelections();
    const attributeAttackSpeed =
      selectedAttribute && selectedAttribute.name === "Agility"
        ? selectedAttribute.amount * 1
        : 0;

    const bootsAttributeAttackSpeed =
      selectedAttribute &&
      selectedAttribute.name === "Agility" &&
      selectedBoots &&
      selectedBoots.name === "Power Treads"
        ? selectedBoots.bonus * 1
        : 0;

    const bootsAttackSpeed = selectedBoots ? selectedBoots.attackSpeed : 0;
    const weaponAttackSpeed = selectedWeapon ? selectedWeapon.attackSpeed : 0;
    const calculatedTotalAttackSpeed =
      heroes.baseAttackSpeed +
      attributeAttackSpeed +
      bootsAttributeAttackSpeed +
      bootsAttackSpeed +
      weaponAttackSpeed;
    setTotalAttackSpeed(calculatedTotalAttackSpeed);
  };

  const calculateMoveSpeed = () => {
    const { selectedBoots } = heroSelections();
    const bootsMoveSpeed = selectedBoots ? selectedBoots.moveSpeed : 0;

    const calculatedMoveSpeed = heroes.baseMoveSpeed + bootsMoveSpeed;
    setTotalMoveSpeed(calculatedMoveSpeed);
  };

  function SubmittedHero({ heroes }) {
    return (
      <div className="submitted-hero">
        <h1>{`${heroes.firstName} ${heroes.lastName}`}</h1>
        <h4>{`Attribute: ${heroes.chosenAttribute}`}</h4>
        <h4>{`Boots: ${heroes.chosenBoots}`}</h4>
        <h4>{`Weapon: ${heroes.chosenWeapon}`}</h4>
        <h5>{`Health = ${totalHealth}`}</h5>
        <h5>{`Mana = ${totalMana}`}</h5>
        <h5>{`Damage = ${totalDamage}`}</h5>
        <h5>{`Attack Speed = ${totalAttackSpeed}`}</h5>
        <h5>{`Move Speed = ${totalMoveSpeed}`}</h5>
      </div>
    );
  }

  function BuiltHero() {
    return (
      <div className="display-hero">
        <h1>{`${heroes.firstName} ${heroes.lastName}`}</h1>
        <h4>{`Attribute: ${heroes.chosenAttribute}`}</h4>
        <h4>{`Boots: ${heroes.chosenBoots}`}</h4>
        <h4>{`Weapon: ${heroes.chosenWeapon}`}</h4>
      </div>
    );
  }

  function ItemImages() {
    return (
      <div className="item-images">
        <h4>Your Items</h4>
        {heroes.chosenBoots === "Power Treads" && (
          <img src="./treads.png" alt="" />
        )}
        {heroes.chosenBoots === "Phase Boots" && (
          <img src="./phase_boots.png" alt="" />
        )}
      </div>
    );
  }

  return (
    <div className="random-hero">
      <Container>
        <Row>
          <Col className="build-hero">
            <label htmlFor="build-hero">Build a new Hero</label>
            <form className="build-hero-form" onSubmit={submitHero}>
              <input
                type="text"
                placeholder="Type first name"
                name="firstName"
                value={heroes.firstName}
                onChange={handleChange}
              />
              <input
                type="text"
                placeholder="Type last name"
                name="lastName"
                value={heroes.lastName}
                onChange={handleChange}
              />

              <Row>
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
                      {/* {`${attribute.name}  ${attribute.effect}`} */}
                      {attribute.name}, {attribute.effect}
                    </label>
                  ))}
                  {/* <Col>
                    {attributes.map((attribute) => (
                      <p>
                        {attribute.effect} {attribute.amount}
                      </p>
                    ))}
                  </Col> */}
                </Col>
              </Row>

              <Row>
                <Col>
                  <h5>Boots</h5>
                  {boots.map((boot) => (
                    <label className="boots-input" key={boot.id}>
                      <input
                        type="radio"
                        name="chosenBoots"
                        value={boot.name} // should the value be boot.id rather than boot.name or does it not matter?
                        checked={heroes.chosenBoots === boot.name}
                        onChange={handleChange}
                      />
                      {boot.name}
                    </label>
                  ))}
                </Col>
              </Row>
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

              <button className="create-hero-button" onSubmit={submitHero}>
                Submit
              </button>
            </form>
          </Col>
          <Col className="item-details">
            <Col>{bootElements}</Col>
            <Col>{weaponsElements}</Col>
          </Col>
          <Col lg={1} className="gold-counter">
            <h2 className="gold-amount">{gold}</h2>
          </Col>
        </Row>
        <Row>
          <Col className="hero-elements">
            Your Selections
            <BuiltHero />
          </Col>
          <Col className="hero-preview">
            Stats Preview
            <h5>{`Health = ${totalHealth}`}</h5>
            <h5>{`Mana = ${totalMana}`}</h5>
            <h5>{`Damage = ${totalDamage}`}</h5>
            <h5>{`Attack Speed = ${totalAttackSpeed}`}</h5>
            <h5>{`Move Speed = ${totalMoveSpeed}`}</h5>
          </Col>
          <Col className="boot-images">
            <div>
              <ItemImages />
            </div>
          </Col>
        </Row>
        <Row>
          <Col>{/* <SubmittedHero /> */}</Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
