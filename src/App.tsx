import React, {CSSProperties, useEffect, useRef, useState} from 'react';
import {Col, Row, Skeleton, Typography} from 'antd';
import './index.css'

const lyrics = [
    "In the morning I catch myself squeezing my pillow tight",
    "And it's pouring as if the sky had feelings just like",
    "Can't ignore it, yeah, even though it still hurts a lot",
    "Would have been a lot worse if I'd",
    'Just let myself cry',
    'Lucky, lucky, lucky, lucky',
    'I am lucky',
    'I am',
    'I',
];

const imgStyle: CSSProperties = {
    width: '90%',
    height: '90%',
    objectFit: 'cover',
    borderRadius: '14px',
};

const textStyle: CSSProperties = {
    color: '#fff',
    textAlign: 'left',
    fontSize: '16px',
    lineHeight: '1.4',
};

const textStyleWithUnderPic: CSSProperties = {
    color: '#fff',
    textAlign: 'left',
    fontSize: '16px',
};
const contentStyle: CSSProperties = {
    position: 'relative',
    zIndex: 2,
    color: '#fff',
    padding: '20px',
    textAlign: 'center',
};
const containerStyle: CSSProperties = {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
};
const innerContainerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
};
const lyricContainerStyle: CSSProperties = {
    position: 'relative',
    width: '95vh',
    height: '65vh',
    overflow: 'hidden',
};


const lineStyle: CSSProperties = {
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
};

const activeLineStyle: CSSProperties = {
    ...lineStyle,
    fontWeight: 'bold',
    color: '#e7b9b9',
    fontSize: '30px',
    lineHeight: '1.5',
};


const App: React.FC = () => {
    const [linePlayTime, setLinePlayTime] = useState(2500)
    const spansRef = useRef<HTMLSpanElement[][]>([]);
    const [loading, setLoading] = useState(true);
    const [currentLine, setCurrentLine] = useState(0);
    const [picSrc, setPicSrc] = useState("https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png");
    const backgroundStyle: CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${picSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(100px)',
        zIndex: 1,
    };
    const scrollStyle: CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        transform: `translateY(-${currentLine * 60}px)`,
        transition: 'transform 0.5s ease',
    };
    const [transitionDuration, setTransitionDuration] = useState('0.3s');
    useEffect(() => {
        document.title = "音乐播放组件";
    }, []);
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentLine((prev) => (prev + 1) % lyrics.length);
        }, linePlayTime);

        return () => clearInterval(interval);
    }, [linePlayTime, lyrics.length]);

    useEffect(() => {
        document.title = String(lyrics[currentLine]);
    }, [currentLine]);


    useEffect(() => {
        if (spansRef.current[currentLine]) {
            const spans = spansRef.current[currentLine];
            const linePlayTime = (2500 / 55) * spans.length;
            const charTransitionDuration = (linePlayTime / linePlayTime) / 1000;
            setTransitionDuration(`${charTransitionDuration}s`);
            setLinePlayTime(linePlayTime);
            spans.forEach((span, index) => {
                setTimeout(() => {
                    span.classList.add('highlight');
                }, index * linePlayTime / spans.length);
            });
        }

    }, [currentLine]);


    return (
        <div style={containerStyle}>
            <div style={backgroundStyle}></div>
            <div style={contentStyle}>
                <Row style={{width: '100%', height: '100%'}}>
                    <Col xs={1} md={1}/>
                    <Col
                        xs={8}
                        md={8}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        {loading ? (<Skeleton.Image
                            active={true}
                            style={{width: '100%', height: 'auto'}}
                        />) : (
                            <div style={innerContainerStyle}>
                                <img alt="Album Art" src={picSrc} style={imgStyle}/>
                                <div style={textStyleWithUnderPic}>
                                    <Typography.Title level={3} style={{color: '#fff'}}>
                                        Lucky
                                    </Typography.Title>
                                    <Typography.Paragraph style={{color: '#aaa'}}>
                                        Zedd, Remi Wolf - Telos
                                    </Typography.Paragraph>
                                </div>
                            </div>
                        )}
                    </Col>
                    <Col xs={15} md={15} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <div style={textStyle}>
                            <div style={lyricContainerStyle}>

                                <div style={scrollStyle}>
                                    {lyrics.map((line: string, index) => {
                                        const words: string[] = line.split('');
                                        if (!spansRef.current[index]) {
                                            spansRef.current[index] = [];
                                        }
                                        return (
                                            <p key={index} style={index === currentLine ? activeLineStyle : lineStyle}>
                                                {index === currentLine ? words.map((word, wordIndex) => (
                                                    <span key={wordIndex}
                                                          style={{
                                                              marginRight: word === ' ' ? '3px' : '0px',
                                                              transition: `background-color ${transitionDuration} ease, color ${transitionDuration} ease`
                                                          }}
                                                          ref={(el) => {
                                                              if (el) spansRef.current[index][wordIndex] = el;
                                                          }}> {word === ' ' ? '\u00A0' : word}</span>
                                                )) : line}
                                            </p>
                                        );
                                    })}
                                </div>


                            </div>


                        </div>
                    </Col>

                </Row>
            </div>
        </div>

    );
};

export default App;
