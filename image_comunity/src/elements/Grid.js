import React from 'react';
import styled from 'styled-components';

const Grid = (props) => {
    const {is_flex, layout, is_container, width, margin, padding, bg, children, center, _onClick} = props;

    const styles = {
        is_flex:is_flex,
        layout:layout,
        width: width,
        margin: margin,
        padding: padding,
        bg: bg,
        center: center,
        is_container,
        _onClick: () => {},
    }
    return (
        <React.Fragment>
            <GridBox {...styles} onClick={_onClick}>
                {children}
            </GridBox>
        </React.Fragment>
    )
}

Grid.defaultProps = {
    children: null,
    is_flex: false,
    layout: '',
    width: '100%',
    padding: false,
    margin: false,
    bg: false,
    center: false,
    is_container:false,
}

const GridBox = styled.div`
    width: ${(props) => props.width};
    height: 100%;
    box-sizing: border-box;
    ${(props) => props.is_container? `max-width:800px; display:flex; flex-direction:column; margin: 5% auto; padding: 2%; border:1px solid lavender;`: ''};
    ${(props) => props.padding? `padding:${props.padding}` : ''};
    ${(props) => props.margin? `margin:${props.margin}` : ''};
    ${(props) => props.bg? `background-color:${props.bg}` : ''};
    ${(props) => props.is_flex? `display:flex; align-itmes:center; justify-content:space-between;`: ''};
    ${(props) => props.layout === 'is_column' && `display:flex; align-itmes:center; justify-content:center; flex-direction:column;`};
    ${(props) => props.layout === 'is_flex' && `display:flex; align-itmes:center; justify-content:space-between;`};
    ${(props) => props.layout === 'is_reverse' && `display:flex; align-itmes:center; justify-content:space-between; flex-direction: row-reverse;`};
    ${(props) => props.is_column? `display:flex; align-itmes:center; justify-content:center; flex-direction:column; `: ''};
    ${(props) => props.is_reverse? `display:flex; align-itmes:center; justify-content:space-between; flex-direction: row-reverse;`: ''};
    ${(props) => props.center? `text-align: center;`: ''};
`;

export default Grid;