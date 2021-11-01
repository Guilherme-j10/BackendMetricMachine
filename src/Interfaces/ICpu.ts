export interface ICpu {
  manufacturer: string,
  brand: string,
  speed: number,
  speedMin: number, 
  speedMax: number,
  cores: number,
  physicalCores: number,
  processors: number,
  virtualization: boolean
}