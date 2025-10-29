import React, { useState, useEffect, useContext } from 'react';
import {ADMIN_ROUTE, LOGIN_ROUTE, ACCOUNT_ROUTE} from "../utils/consts";
import { useNavigate } from 'react-router-dom';
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const CalculateComponents = observer(() => {
    const [transportCompany, setTransportCompany] = useState('0');
    const [volume, setVolume] = useState('0');
    const [units, setUnits] = useState('0');
    const [sides, setSides] = useState('0');
    const [marking, setMarking] = useState(false);
    const [defectCheck, setDefectCheck] = useState(false);
    const [packaging, setPackaging] = useState(false);
    const [collect, setCollect] = useState(false);
    const [remtag, setRemtag] = useState(false);
    const [addtag, setAddtag] = useState(false);
    const [sealing, setSealing] = useState(false);
    const [box, setBox] = useState(false);
    const [slider, setSlider] = useState(false);
    const [zip, setZip] = useState(false);
    const [bubble, setBubble] = useState(false);
    const [stretch, setStretch] = useState(false);
    const [moscow, setMoscow] = useState(false);
    const [saintPetersburg, setSaintPetersburg] = useState(false);
    const [tula, setTula] = useState(false);
    const [kazan, setKazan] = useState(false);
    const [krasnodar, setKrasnodar] = useState(false);
    const [yekaterinburg, setYekaterinburg] = useState(false);
    const [nevinnomyssk, setNevinnomyssk] = useState(false);
    const [showPackagingOptions, setShowPackagingOptions] = useState(false);

    const navigate = useNavigate();
    const { user } = useContext(Context);
    const { manager } = useContext(Context);

    const handleCreateOrder = () => {
        if (user.isAuth) {
            navigate(ACCOUNT_ROUTE);
        } else if (manager.isAdmin) {
            navigate(ADMIN_ROUTE);
        } else {
            navigate(LOGIN_ROUTE);
        }
    };

    const handleVolumeChange = (e) => {
        const newValue = e.target.value;
        if (newValue >= 0) {
            setVolume(newValue);
        }
    }

    const handleSidesChange = (e) => {
        const newValue = e.target.value;
        if (newValue >= 0) {
            setSides(newValue);
        }
    }

    const handleUnitsChange = (e) => {
        const newValue = e.target.value;
        if (newValue >= 0) {
            setUnits(newValue);
        }
    }

    const handleTransportChange = (e) => {
        setTransportCompany(e.target.value);
    }

    const handleMarkingChange = (e) => {
        setMarking(e.target.checked);
    }

    const handleDefectCheckChange = (e) => {
        setDefectCheck(e.target.checked);
    }

    const handlePackagingChange = (e) => {
        setPackaging(e.target.checked);
        const { checked } = e.target;
        setPackaging(checked);
        setShowPackagingOptions(checked);
    }

    const handleCollectChange = (e) => {
        setCollect(e.target.checked);
    }

    const handleRemtagChange = (e) => {
        setRemtag(e.target.checked);
    }

    const handleAddtagChange = (e) => {
        setAddtag(e.target.checked);
    }

    const handleSealingChange = (e) => {
        setSealing(e.target.checked);
    }

    const handleBoxChange = (e) => {
        setBox(e.target.checked);
    }

    const handleSliderChange = (e) => {
        setSlider(e.target.checked);
    }

    const handleZipChange = (e) => {
        setZip(e.target.checked);
    }

    const handleStretchChange = (e) => {
        setStretch(e.target.checked);
    }

    const handleBubbleChange = (e) => {
        setBubble(e.target.checked);
    }

    const handleMoscowChange = (e) => {
        setMoscow(e.target.checked);
    }
    const handleSaintPetersburgChange = (e) => {
        setSaintPetersburg(e.target.checked);
    }
    const handleTulaChange = (e) => {
        setTula(e.target.checked);
    }
    const handleKazanChange = (e) => {
        setKazan(e.target.checked);
    }
    const handleKrasnodarChange = (e) => {
        setKrasnodar(e.target.checked);
    }
    const handleYekaterinburgChange = (e) => {
        setYekaterinburg(e.target.checked);
    }
    const handleNevinnomysskChange = (e) => {
        setNevinnomyssk(e.target.checked);
    }

    // Обновление суммы заказа при изменении какого-либо параметра
    useEffect(() => {
    }, [transportCompany, volume, units, sides, marking, defectCheck, packaging, collect, remtag, addtag,
        sealing, slider, zip, stretch, bubble, box, moscow, saintPetersburg, tula, kazan, krasnodar, yekaterinburg, nevinnomyssk]);

    // Функция для вычисления общей суммы заказа
    const calculateTotal = () => {
        let total = 0;

        /// Если выбран забор от транспортной компании, добавляем его стоимость к общей сумме
        if (parseFloat(transportCompany) === 1250) {
            total += 1250;
        }


        // Если введен объем товара и выбран забор от транспортной компании
        if (parseFloat(volume) && parseFloat(transportCompany) === 1250) {
            // Если объем меньше или равен 1, общая сумма остается 1250
            if (parseFloat(volume) <= 1) {
                total = 1250;
            } else {
                // Если объем больше 1, умножаем стоимость забора на объем
                total = 1250 * parseFloat(volume);
            }
        }

        const basePrice = calculateBasePrice(sides);
        total += parseFloat(units) * basePrice;

        let additionalServicesPrice = 0;
        if (marking) additionalServicesPrice += 3;
        if (defectCheck) additionalServicesPrice += 4;
        if (packaging) additionalServicesPrice += 4;
        if (collect) additionalServicesPrice += 6;
        if (remtag) additionalServicesPrice += 2;
        if (addtag) additionalServicesPrice += 3;

        let unitPrice = parseFloat(units) * additionalServicesPrice;
        total += unitPrice;

        let additionalPackagePrice = 0;
        if (box) additionalPackagePrice += 10;
        if (sealing) additionalPackagePrice += 4;
        if (slider) additionalPackagePrice += 6;
        if (zip) additionalPackagePrice += 4;
        if (stretch) additionalPackagePrice += 3;
        if (bubble) additionalPackagePrice += 3;

        let servicePrice = parseFloat(units) * additionalPackagePrice;
        total += servicePrice;

        let additionalCitiesPrice = 0;
        if (krasnodar) additionalCitiesPrice += 6900;
        if (moscow) additionalCitiesPrice += 4600;
        if (saintPetersburg) additionalCitiesPrice += 1250;
        if (tula) additionalCitiesPrice += 5500;
        if (kazan) additionalCitiesPrice += 6900;
        if (yekaterinburg) additionalCitiesPrice += 6900;
        if (nevinnomyssk) additionalCitiesPrice += 8300;

        // Стоимость отгрузки
        let shipmentPrice = parseFloat(volume) * additionalCitiesPrice;
        total += shipmentPrice;

        return total;
    }

    // Функция для определения начальной стоимости за одну единицу товара в зависимости от суммы всех сторон
    const calculateBasePrice = (sides) => {
        if (parseFloat(sides) >= 0 && parseFloat(sides) < 40) return 24;
        else if (parseFloat(sides) >= 40 && parseFloat(sides) < 70) return 28;
        else if (parseFloat(sides) >= 70 && parseFloat(sides) < 100) return 32;
        else return 38;
    }

    return (
        <div id="calculate" className="container">
            <form id="form">
                <div className="heading">
                    <h1 className="text-center mb-3">Калькулятор стоимости</h1>
                    <p className="heading-desc text-center mb-3">Рассчитайте примерную стоимость работы</p>
                </div>

                <div className="calc-section">
                    <label className="checkbox-wrapper title-bold section-title .section-title--vertical-center">
                        <span className="title__inline">Объем товара:</span>
                        <input type="number" id="volume-input" name="volume"
                               className="title__inline input-short"
                               min="0"
                               value={volume}
                               onChange={handleVolumeChange}/>
                        <span className="title__inline">м³</span>
                    </label>
                </div>

                <div className="calc-section">
                    <label className="checkbox-wrapper title-bold section-title .section-title--vertical-center">
                        <span className="title__inline">Сумма всех сторон:</span>
                        <input type="number" id="sides-input" name="sides"
                               className="title__inline input-short"
                               min="0"
                               value={sides}
                               onChange={handleSidesChange}/>
                        <span className="title__inline">см</span>
                    </label>
                </div>

                <div className="calc-section">
                    <label className="checkbox-wrapper title-bold section-title .section-title--vertical-center">
                        <span className="title__inline">Количество товара:</span>
                        <input type="number" id="units-input" name="units"
                               className="title__inline input-short"
                               min="0"
                               value={units}
                               onChange={handleUnitsChange}/>
                        <span className="title__inline">шт</span>
                    </label>
                </div>

                <div className="calc-section">
                    <h4 className="checkbox-wrapper title-bold section-title">Забор товара</h4>
                    <label className="radio-wrapper" data-name="mobile">
                        <input type="radio" className="radio" name="transport"
                               value="0"
                               checked={transportCompany === '0'}
                               onChange={handleTransportChange}/>
                        <div className="title-lite">Привезу сам
                            <span className="note">Адрес склада: 196624, г. Санкт-Петербург, Новгородский проспект, д. 2к3</span>
                        </div>
                    </label>
                    <label className="radio-wrapper" data-name="mobile">
                        <input type="radio" className="radio" name="transport" value="1250"
                               checked={transportCompany === '1250'}
                               onChange={handleTransportChange}/>
                        <div className="title-lite">Из транспортной компании</div>
                    </label>
                </div>

                <div className="calc-section">
                    <label className="checkbox-wrapper title-bold section-title">Необходимые работы</label>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)'}}>
                        <label className="radio-wrapper">
                            <input type="checkbox" className="radio" name="marking"
                                   checked={marking}
                                   onChange={handleMarkingChange}/>
                            <div className="title-lite">Маркировка товара</div>
                        </label>
                        <label className="radio-wrapper">
                            <input type="checkbox" className="radio" name="defectCheck"
                                   checked={defectCheck}
                                   onChange={handleDefectCheckChange}/>
                            <div className="title-lite">Проверка на брак</div>
                        </label>
                        <label className="radio-wrapper">
                            <input type="checkbox" className="radio" name="packaging"
                                   checked={packaging}
                                   onChange={handlePackagingChange}/>
                            <div className="title-lite">Упаковка товара</div>
                        </label>
                        <label className="radio-wrapper">
                            <input type="checkbox" className="radio" name="collect"
                                   checked={collect}
                                   onChange={handleCollectChange}/>
                            <div className="title-lite">Сборный товар</div>
                        </label>
                        <label className="radio-wrapper" style={{marginBottom: 0}}>
                            <input type="checkbox" className="radio" name="remtag"
                                   checked={remtag}
                                   onChange={handleRemtagChange}/>
                            <div className="title-lite">Убрать бирку</div>
                        </label>
                        <label className="radio-wrapper">
                            <input type="checkbox" className="radio" name="addtag"
                                   checked={addtag}
                                   onChange={handleAddtagChange}/>
                            <div className="title-lite">Добавить бирку</div>
                        </label>
                    </div>
                </div>

                <div className="calc-section">
                    {showPackagingOptions && (
                        <>
                            <label className="checkbox-wrapper title-bold section-title">Упаковка</label>
                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)'}}>
                                <label className="radio-wrapper">
                                    <input type="checkbox" className="radio" name="box"
                                           checked={box}
                                           onChange={handleBoxChange}/>
                                    <div className="title-lite">Картонная коробка</div>
                                </label>
                                <label className="radio-wrapper">
                                    <input type="checkbox" className="radio" name="bubble"
                                           checked={bubble}
                                           onChange={handleBubbleChange}/>
                                    <div className="title-lite">Пупырчатая пленка</div>
                                </label>
                                <label className="radio-wrapper">
                                    <input type="checkbox" className="radio" name="stretch"
                                           checked={stretch}
                                           onChange={handleStretchChange}/>
                                    <div className="title-lite">Стрейч пленка</div>
                                </label>
                                <label className="radio-wrapper">
                                    <input type="checkbox" className="radio" name="zip"
                                           checked={zip}
                                           onChange={handleZipChange}/>
                                    <div className="title-lite">ZIP-пакет</div>
                                </label>
                                <label className="radio-wrapper" style={{marginBottom: 0}}>
                                    <input type="checkbox" className="radio" name="slider"
                                           checked={slider}
                                           onChange={handleSliderChange}/>
                                    <div className="title-lite">Пакет с бегунком</div>
                                </label>
                                <label className="radio-wrapper">
                                    <input type="checkbox" className="radio" name="seeling"
                                           checked={sealing}
                                           onChange={handleSealingChange}/>
                                    <div className="title-lite">Запайка в плёнку</div>
                                </label>
                            </div>
                        </>
                    )}
                </div>

                <div className="calc-section">
                    <label className="checkbox-wrapper title-bold section-title">Отгрузка</label>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)'}}>
                        <label className="radio-wrapper">
                            <input type="checkbox" className="radio" name="noCity" value="0"/>
                            <div className="title-lite">Не требуется</div>
                        </label>
                        <label className="radio-wrapper">
                            <input type="checkbox" className="radio" name="saintPetersburg"
                                   checked={saintPetersburg}
                                   onChange={handleSaintPetersburgChange}/>
                            <div className="title-lite">Санкт-Петербург</div>
                        </label>
                        <label className="radio-wrapper">
                            <input type="checkbox" className="radio" name="moscow"
                                   checked={moscow}
                                   onChange={handleMoscowChange}/>
                            <div className="title-lite">Москва</div>
                        </label>
                        <label className="radio-wrapper">
                            <input type="checkbox" className="radio" name="tula"
                                   checked={tula}
                                   onChange={handleTulaChange}/>
                            <div className="title-lite">Тула</div>
                        </label>
                        <label className="radio-wrapper">
                            <input type="checkbox" className="radio" name="kazan"
                                   checked={kazan}
                                   onChange={handleKazanChange}/>
                            <div className="title-lite">Казань</div>
                        </label>
                        <label className="radio-wrapper">
                            <input type="checkbox" className="radio" name="krasnodar"
                                   checked={krasnodar}
                                   onChange={handleKrasnodarChange}/>
                            <div className="title-lite">Краснодар</div>
                        </label>
                        <label className="radio-wrapper" style={{marginBottom: 0}}>
                            <input type="checkbox" className="radio" name="yekaterinburg"
                                   checked={yekaterinburg}
                                   onChange={handleYekaterinburgChange}/>
                            <div className="title-lite">Екатеринбург</div>
                        </label>
                        <label className="radio-wrapper">
                            <input type="checkbox" className="radio" name="nevinnomyssk"
                                   checked={nevinnomyssk}
                                   onChange={handleNevinnomysskChange}/>
                            <div className="title-lite">Невинномысск</div>
                        </label>
                    </div>
                </div>

                <div className="calc-price">
                    <div className="calc-price-title">Стоимость работ:</div>
                    <div className="calc-price-value">
                        <span id="total-price">{calculateTotal()} </span>
                        рублей
                    </div>
                    <button type="button" className="create-order-btn" onClick={handleCreateOrder}>
                        Создать заказ
                    </button>
                </div>

            </form>
            <div style={{height: '110px'}}></div>
        </div>
    );
});

export default CalculateComponents;