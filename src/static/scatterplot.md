This is a __placeholder__.

```
render() {
  const {data, viewport, params} = this.props;

  const layer = new ScatterplotLayer({
    id: 'scatter-plot',
    ...this.props.viewport,
    data: data.map(d => ({
      position: {x: Number(d.X), y: Number(d.Y), z: 0},
      color: params.color.value,
      radius: params.radius.value
    })),
    isPickable: true
  });

  return (
    <DeckGLOverlay {...viewport} layers={ [layer] } />
  );
}
```
