import image111 from './assets/products/111.svg'
import imageLost from './assets/products/lost.svg'
import imageCamera from './assets/products/camera.svg'
import imageTenbai from './assets/products/tenbai.svg'
import imageColor from './assets/products/color.svg'
import imageDetective from './assets/products/detective.svg'

export const defaultProducts = [
  { id: '111', name: '111', price: 3000, color: 'coral', note: 'レーベルブラック', image: image111 },
  { id: 'lost', name: 'なくしもの', price: 1000, color: 'blue', note: 'レーベルホワイト', image: imageLost },
  { id: 'camera', name: 'ジャストインカメラ', price: 1650, color: 'yellow', note: '', image: imageCamera },
  { id: 'tenbai', name: '転売注意', price: 2500, color: 'green', note: '', image: imageTenbai },
  { id: 'color', name: '色覚', price: 1000, color: 'purple', note: '', image: imageColor },
  { id: 'detective', name: 'NUMBER+', price: 500, color: 'orange', note: '', image: imageDetective },
]
