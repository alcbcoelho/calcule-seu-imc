import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { IconDefinition } from '@fortawesome/free-regular-svg-icons';
import { faTriangleExclamation, faCircleCheck, faSkullCrossbones } from '@fortawesome/free-solid-svg-icons';
import styles from './styles/App.module.css'

enum BMIClassification {
  SevereThinness = "Você está com magreza severa. Alimente-se!",
  ModerateThinness = "Você está bem magro.",
  Underweight = "Você está abaixo do peso.",
  Healthy = "Você está dentro da normalidade.",
  Overweight = "Você está acima do peso.",
  Obesity1 = "Você está no grau 1 de obesidade.",
  Obesity2 = "Você está no grau 2 de obesidade. Modere-se!",
  Obesity3 = "Você está com obesidade mórbida. Cuide-se urgentemente!"
};

const getBMIClassification = (bmiResult: number): BMIClassification => {
  if (bmiResult < 16) {
    return BMIClassification.SevereThinness;
  } else if (bmiResult >= 16 && bmiResult <= 17) {
    return BMIClassification.ModerateThinness;
  } else if (bmiResult > 17 && bmiResult < 18.5) {
    return BMIClassification.Underweight;
  } else if (bmiResult >= 18.5 && bmiResult <= 24.99) {
    return BMIClassification.Healthy;
  } else if (bmiResult >= 25 && bmiResult <= 29.99) {
    return BMIClassification.Overweight;
  } else if (bmiResult >= 30 && bmiResult <= 34.99) {
    return BMIClassification.Obesity1;
  } else if (bmiResult >= 35 && bmiResult <= 39.99) {
    return BMIClassification.Obesity2;
  } else
    return BMIClassification.Obesity3;
}

const getCSSModifier = (classification: BMIClassification): string => {
  let modifier;

  switch (classification) {
    case BMIClassification.Healthy:
      modifier = "--good";
      break;
    case BMIClassification.Underweight:
    case BMIClassification.Overweight:
      modifier = "--ok";
      break;
    case BMIClassification.Obesity1:
    case BMIClassification.ModerateThinness:
      modifier = "--concerning";
      break;
    case BMIClassification.Obesity2:
    case BMIClassification.SevereThinness:
      modifier = "--bad";
      break;
    case BMIClassification.Obesity3:
      modifier = "--extreme";
  }
  
  return `bmi-result__classification${modifier}`
}

const getIcon = (classification: BMIClassification): IconDefinition | null => {
  switch (classification) {
    case BMIClassification.Healthy:
      return faCircleCheck;
    case BMIClassification.ModerateThinness:
    case BMIClassification.Obesity1:
    case BMIClassification.Obesity2:
    case BMIClassification.SevereThinness:
      return faTriangleExclamation;
    case BMIClassification.Obesity3:
      return faSkullCrossbones;
    default:
      return null;
  }
}

function App() {
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [weight, setWeight] = useState<number | undefined>(undefined);

  const calculateBMI = (): number => {
    const heightToMeters = height as number / 100;
    return weight as number / Math.pow(heightToMeters, 2);
  }
  
  const handleChangeHeight = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(+e.target.value);
  }
  
  const handleChangeWeight = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(+e.target.value);
  }

  const classification = getBMIClassification(calculateBMI());

  return (
    <div className="container flex-container">
      <div className={`${styles['main-element']} flex-container`}>
        <h1 className={`${styles['main-element__heading']} text--display`}>Calcule seu IMC</h1>
        <form className={`${styles['main-element__form']}`}>
          <div className={`${styles['main-element__form__field']}`}>
            <label htmlFor="height">Sua altura <span className="text--small">(em centímetros)</span>:</label>
            <input id="height" type="number" placeholder="e.g: 175" onChange={handleChangeHeight} min={1} max={300} />
          </div>
          <div className={`${styles['main-element__form__field']}`}>
            <label htmlFor="weight">Seu peso <span className="text--small">(em quilogramas)</span>:</label>
            <input id="weight" type="number" placeholder="e.g: 80" onChange={handleChangeWeight} min={1} max={1000} />
          </div>
        </form>
        <p className={`${styles['bmi-result__value']} text--display`}>
          { isNaN(calculateBMI()) ? "?" : "= " + calculateBMI().toFixed(2) }
        </p>
        {
          !isNaN(calculateBMI()) && (
            <p className={`${styles['bmi-result__classification']} ${styles[getCSSModifier(getBMIClassification(calculateBMI()))]} text--display`}>
              { getIcon(classification) && (
                <FontAwesomeIcon icon={getIcon(classification) as unknown as IconDefinition} size="lg" className="icon" />
              ) }
              { getBMIClassification(calculateBMI()) }
            </p>
          )
        }
      </div>
    </div>
  )
}

export default App

/*
TODO: (para commits futuros)
- Tornar responsivo
- Componentizar
- Transformar o parágrafo de classificação num componente que é re-renderizado a cada mudança de resultado
*/