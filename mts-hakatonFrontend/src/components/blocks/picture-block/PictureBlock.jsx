import './picture-block.css';
import { useEffect, useState, useRef } from 'react';
import saveSvg from './savesvg.svg';
import manJpg from './man.jpg';
import pencilSng from './pencil.svg';
import goBack from './goback.svg';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PictureBlock = () => {
    const [cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDefect, setSelectedDefect] = useState(null);
    const [isChecking, setIsChecking] = useState(false);

    const svgContainerRef = useRef(null);

    const saveCardsAsPDF = async () => {
        const cards = document.querySelectorAll(".picture-block__left-block");
      
        if (cards.length === 0) {
          alert("Нет карточек для сохранения");
          return;
        }
      
        const pdf = new jsPDF("p", "mm", "a4");
        const padding = 10;
        const pageWidth = 210;
        const _pageHeight = 297;
        let _yOffset = 0;
        let firstPage = true;
      
        for (const card of cards) {
          const canvas = await html2canvas(card, {
            scale: 2,
          });
      
          const imgData = canvas.toDataURL("image/png");
          const imgProps = pdf.getImageProperties(imgData);
          const imgWidth = pageWidth - padding * 2;
          const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      
          if (!firstPage) {
            pdf.addPage();
          } else {
            firstPage = false;
          }
      
          pdf.addImage(imgData, "PNG", padding, 10, imgWidth, imgHeight);
        }
      
        pdf.save("cards.pdf");
      };

    const removeSelectedDefect = () => {
        if (selectedDefect !== null && selectedCard?.defects) {
          const updatedDefects = selectedCard.defects.filter(defect => defect.id !== selectedDefect);
    
          setSelectedCard(prev => ({
            ...prev,
            defects: updatedDefects
          }));
    
          setSelectedDefect(null);
        }
    };

    const performCheck = async () => {
        setIsChecking(true);
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/check', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error('Ошибка при выполнении проверки');
            }
            
            const data = await response.json();
            setCards(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsChecking(false);
            setLoading(false);
        }
    };
    
    useEffect(() => {
        // Просто устанавливаем, что начальной загрузки нет
        setLoading(false);
    }, []);



    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="picture-block__container">
            {selectedCard ? (
                <div>
                    <button className="picture-block__arrowbtn" onClick={() => setSelectedCard(null)}>
                        <img
                            src={goBack}
                            alt="preview"
                            className="picture-block__arrow"
                        />
                    </button>

                    <div className="picture-block__blocks-list">
                        <div className="picture-block__blocks1">
                            <div className="picture-block__left-block">
                                <div className="picture-block__image-wrapper">
                                  <img
                                    src={selectedCard?.processedImage || manJpg}
                                    alt="preview"
                                    className="picture-block__img"
                                  />

                                  <div className="picture-block__svg-overlay" ref={svgContainerRef}>
                                    {selectedCard.defects.map((defect) => (
                                      <img
                                        key={defect.id}
                                        src={defect.correctionSvg}
                                        data-id={defect.id}
                                        alt={`defect-${defect.id}`}
                                        className="picture-block__svg-image"
                                      />
                                    ))}
                                  </div>
                                </div>
                            </div>

                            <div className="picture-block__right-block">
                                <p className="picture-block__name-file">{selectedCard.filename}</p>

                                <div className="picture-block__result">
                                    <p className="picture-block__result-text1">РЕЗУЛЬТАТ:</p>
                                    <div className="picture-block__results">
                                        <div className="picture-block__result1">
                                            <p className="picture-block__result-percent">
                                                {selectedCard.matchPercent}%
                                            </p>
                                            <p className="picture-block__result-text2">
                                                совпадение<br />с примером
                                            </p>
                                        </div>
                                        <div className="picture-block__result2">
                                            <p className="picture-block__result-percent">
                                                {selectedCard.confidence}%
                                            </p>
                                            <p className="picture-block__result-text2">
                                                уверенность ИИ<br />в своем вердикте
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="picture-block__defects">
                                    <p className="picture-block__defect-text">ДЕФЕКТЫ:</p>
                                    <div className="picture-block__defect-list">
                                        {selectedCard.defects.map((defect) => (
                                            <div className="picture-block__defect" key={defect.id}>
                                                <div className="picture-block__defect1-part1">
                                                    <p className="picture-block__defect-text1">{defect.type}</p>
                                                    <img
                                                        src={pencilSng}
                                                        alt="pencil"
                                                        className={`picture-block__svg1 ${selectedDefect === defect.id ? 'selected' : ''}`}
                                                        onClick={() => setSelectedDefect(defect.id)}
                                                    />
                                                </div>

                                                <div className="picture-block__defect1-part2">
                                                    <p className="picture-block__defect-text1">{defect.region}</p>
                                                    <img
                                                        src={pencilSng}
                                                        alt="pencil"
                                                        className={`picture-block__svg1 ${selectedDefect === defect.id ? 'selected' : ''}`}
                                                        onClick={() => setSelectedDefect(defect.id)}
                                                    />
                                                    
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="picture-block__btns">
                                    <button className="picture-block__btn2" onClick={removeSelectedDefect}>
                                        Удалить дефект
                                    </button>
                                    <button className="picture-block__btn3"  onClick={saveCardsAsPDF}>
                                        Сохранить карточку
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="picture-block__title">
                        <p className="picture-block__text">ВАШИ ИЗОБРАЖЕНИЯ</p>
                        <div className="picture-block__header-buttons">
                            <button 
                                className="picture-block__btn1"
                                onClick={performCheck}
                                disabled={isChecking}
                            >
                                {isChecking ? 'Проверка...' : 'Выполнить проверку'}
                            </button>
                            <button 
                                className="picture-block__btn1" 
                                onClick={saveCardsAsPDF}
                            >
                                Сохранить все карточки
                            </button>
                        </div>
                        <div>
                            <img src={saveSvg} alt="download" className="picture-block__svg" />
                        </div>
                    </div>

                    <div className="picture-block__blocks-list">
                        {cards.map((card, index) => (
                            <div className="picture-block__blocks1" key={index}>
                                <div className="picture-block__left-block">
                                    <div className="picture-block__image-wrapper">
                                      <img
                                        src={card.processedImage || manJpg}
                                        alt="preview"
                                        className="picture-block__img"
                                      />
                                      <div className="picture-block__svg-overlay" ref={svgContainerRef}>
                                            {card.defects?.map((defect) => (
                                          <img
                                            key={defect.id}
                                            src={defect.correctionSvg}
                                            data-id={defect.id}
                                            alt={`defect-${defect.id}`}
                                            className="picture-block__svg-image"
                                          />
                                        ))}
                                      </div>
                                    </div>
                                </div>

                                <div className="picture-block__right-block">
                                    <p className="picture-block__name-file">{card.filename}</p>

                                    <div className="picture-block__result">
                                        <p className="picture-block__result-text1">РЕЗУЛЬТАТ:</p>
                                        <div className="picture-block__results">
                                            <div className="picture-block__result1">
                                                <p className="picture-block__result-percent">
                                                    {card.matchPercent}%
                                                </p>
                                                <p className="picture-block__result-text2">
                                                    совпадение<br />с примером
                                                </p>
                                            </div>
                                            <div className="picture-block__result2">
                                                <p className="picture-block__result-percent">
                                                    {card.confidence}%
                                                </p>
                                                <p className="picture-block__result-text2">
                                                    уверенность ИИ<br />в своем вердикте
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="picture-block__btns">
                                        <div>
                                            <button 
                                                className="picture-block__btn2" 
                                                onClick={() => setSelectedCard(card)}
                                            >
                                                Внести изменения
                                            </button>
                                        </div>

                                        <div>
                                            <button className="picture-block__btn3"  onClick={saveCardsAsPDF}>
                                                Сохранить карточку
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PictureBlock;
