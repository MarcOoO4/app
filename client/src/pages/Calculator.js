import {Container} from "react-bootstrap";
import CalculatorComponent from "../components/CalculateComponents";
import React from "react";

const Calculator = () => {
    return (
        <Container className="d-flex flex-column mt-5">
            <CalculatorComponent/>
        </Container>
    );
};

export default Calculator;