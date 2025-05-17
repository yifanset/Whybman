import './download-block.css';
import downloadSvg from './downloadsvg.svg';
import moredownloadSvg from './moredownloadsvg.svg';
import { useState } from 'react';

const DownloadBlock = () => {
    const [leftFile, setLeftFile] = useState(null);
    const [rightFiles, setRightFiles] = useState([]);
    const [checkedState, setCheckedState] = useState({
        checkbox1: false,
        checkbox2: false,
        checkbox3: false
    });
    // const [selectedNumber] = useState(0);

    const defectTypes = [
        { id: 1, name: "Смазанная картинка" },
        { id: 2, name: "Искаженные тексты" },
        { id: 3, name: "Несоответствие цветов" }
    ];
    
    const handleCheckboxChange = (event) => {
      const { name, checked } = event.target;
      setCheckedState(prev => ({
        ...prev,
        [name]: checked
      }));
    };

    const handleLeftFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLeftFile(file);
        }
    };

    const handleRightFilesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 20) {
            alert('Максимальное количество файлов - 20');
            return;
        }
        setRightFiles(files);
    };
    
    // const handleSubmit = async () => {
    //     // Валидация
    //     if (!leftFile || rightFiles.length === 0) {
    //         alert('Пожалуйста, загрузите файлы в оба блока');
    //         return;
    //     }
    //     const selectedDefects = defectTypes
    //         .filter((_, i) => checkedState[`checkbox${i+1}`])
    //         .map(d => d.id);
    //         if (selectedDefects.length === 0) {
    //             alert('Пожалуйста, выберите хотя бы один тип дефекта.');
    //             return;
    //         }
    
    //     // const formData = new FormData();
    //     // // 1) Массив файлов files[0] = эталон, files[1..n] = файлы на проверку
    //     // formData.append('files', leftFile); // эталон
    //     // rightFiles.forEach((file) => {
    //     //     formData.append('files', file); // остальные файлы
    //     // });
    //     // // 2) Текстовая часть JSON-массива ID дефектов
    //     // formData.append('defectTypes', JSON.stringify(selectedDefects));
    //     const formData = new FormData();
    //     formData.append('defectTypes', JSON.stringify(selectedDefects));  // Добавляем массив дефектов

    //     formData.append('files', leftFile);  // Эталон
    //     rightFiles.forEach((file) => {
    //     formData.append('files', file);  // Оставшиеся файлы
    //     });
    
    //     try {
    //         const response = await fetch('http://localhost:5000/upload', { // сюда апи 
    //             method: 'POST',
    //             body: formData,
    //         });
    //         if (!response.ok) {
    //             throw new Error('Ошибка при отправке файлов');
    //         }
    //         const result = await response.json();
    //         console.log('Файлы успешно отправлены:', result);
    //         alert('Файлы успешно отправлены на проверку');
    //         setLeftFile(null);
    //         setRightFiles([]);
    //         setCheckedState({ checkbox1: false, checkbox2: false, checkbox3: false });
    //     } catch (error) {
    //         console.error('Ошибка:', error);
    //         alert('Произошла ошибка при отправке файлов');
    //     }
    // };

    const handleSubmit = async () => {
        if (!leftFile || rightFiles.length === 0) {
            alert('Пожалуйста, загрузите файлы в оба блока');
            return;
        }
        const selectedDefects = defectTypes
            .filter((_, i) => checkedState[`checkbox${i+1}`])
            .map(d => d.id);
        if (selectedDefects.length === 0) {
            alert('Пожалуйста, выберите хотя бы один тип дефекта.');
            return;
        }
    
        const formData = new FormData();
        // formData.append('number', selectedNumber); // <- вот это обязательно
        formData.append('defectTypes', JSON.stringify(selectedDefects)); // Добавляем массив дефектов
    
        formData.append('files', leftFile);  // Эталон
        rightFiles.forEach((file) => {
            formData.append('files', file);  // Оставшиеся файлы
        });
    
        // Логируем содержимое FormData
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
    
        try {
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error('Ошибка при отправке файлов');
            }
            const result = await response.json();
            console.log('Файлы успешно отправлены:', result);
            alert('Файлы успешно отправлены на проверку');
            setLeftFile(null);
            setRightFiles([]);
            setCheckedState({ checkbox1: false, checkbox2: false, checkbox3: false });
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при отправке файлов');
        }
    };

    
      

    return (
        <div className='download-block__container'>
            <div className="download-block__typedefects">
                <p className="download-block__text">ТИПЫ ДЕФЕКТОВ</p>
                <div className="download-block__typedefects-list">
                    {defectTypes.map((defect, index) => (
                      <div key={`checkbox${index + 1}`} className="download-block__checkbox-item">
                        <input
                          type="checkbox"
                          id={`checkbox${index + 1}`}
                          name={`checkbox${index + 1}`}
                          className="download-block__checkbox-input"
                          checked={checkedState[`checkbox${index + 1}`]}
                          onChange={handleCheckboxChange}
                        />
                        <label htmlFor={`checkbox${index + 1}`} className="download-block__checkbox-label">
                           {defect.name}
                        </label>
                      </div>
                    ))}                   
                </div>
            </div>


            <p className="download-block__text">ЗАГРУЗКА ФАЙЛОВ</p>
            <div className="download-block__blocks">
                <div className="download-block__left-block">
                    <div className="download-block__block">
                        <div className="download-block__text-overlay">
                            ВАШ ЭТАЛОН
                        </div>
                        <div className="download-block__content">
                            {leftFile ? (
                                <div className="download-block__file-info">
                                    <p>{leftFile.name}</p>
                                    <p>{(leftFile.size / 1024).toFixed(2)} KB</p>
                                </div>
                            ) : (
                                <>
                                    <div className="download-block__download">
                                        <img 
                                            src={downloadSvg} 
                                            alt="download" 
                                            className="download-block__svg"
                                        />
                                        <div className="download-block__text1">
                                            1 файл
                                        </div>
                                    </div>
                                    
                                </>
                            )}
                        </div>
                    </div>
                    <div className="">
                        <input 
                            type="file" 
                            id="left-file-input" 
                            style={{ display: 'none' }} 
                            onChange={handleLeftFileChange}
                            accept="*"
                        />
                        <button 
                            className="download-block__btn"
                            onClick={() => document.getElementById('left-file-input').click()}
                        >
                            {leftFile ? 'Файл выбран' : 'Выберите файл'}
                        </button>
                    </div>
                </div>

                <div className="download-block__right-block">
                    <div className="download-block__block">
                        <div className="download-block__text-overlay">
                            ЧТО ПРОВЕРИТЬ
                        </div>
                        <div className="download-block__content">
                            {rightFiles.length > 0 ? (
                                <div className="download-block__files-list">
                                    <p>Выбрано файлов: {rightFiles.length}/20</p>
                                    {rightFiles.slice(0, 3).map((file, index) => (
                                        <p key={`${file.name}-${index}`}>{file.name}</p>
                                    ))}
                                    {rightFiles.length > 3 && <p>...и еще {rightFiles.length - 3}</p>}
                                </div>
                            ) : (
                                <>
                                    <div className="download-block__download">
                                        <img 
                                            src={moredownloadSvg} 
                                            alt="download" 
                                            className="download-block__svg"
                                        />
                                        <div className="download-block__text1">
                                            максимум<br/>20 файлов
                                        </div>
                                    </div>
                                    
                                </>
                            )}
                        </div>
                    </div>
                    <div className="">
                        <input 
                            type="file" 
                            id="right-files-input" 
                            style={{ display: 'none' }} 
                            onChange={handleRightFilesChange}
                            multiple
                            accept="*"
                        />
                        <button 
                            className="download-block__btn"
                            onClick={() => document.getElementById('right-files-input').click()}
                        >
                            {rightFiles.length > 0 ? `Выбрано ${rightFiles.length} файлов` : 'Выберите файлы'}
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="download-block__submit-container">
                <button 
                    className="download-block__submit-btn"
                    onClick={handleSubmit}
                >
                    Начать проверку
                </button>
            </div>
        </div>
    )
}

export default DownloadBlock;