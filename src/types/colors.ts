export type ColorAPIResponse = {
  hex: {
    value: string;
    clean: string;
  };
  rgb: {
    fraction: {
      r: number;
      g: number;
      b: number;
    };
    r: number;
    g: number;
    b: number;
    value: string;
  };
  hsl: {
    fraction: {
      h: number;
      s: number;
      l: number;
    };
    h: number;
    s: number;
    l: number;
    value: string;
  };
  hsv: {
    fraction: {
      h: number;
      s: number;
      v: number;
    };
    h: number;
    s: number;
    v: number;
    value: string;
  };
  name: {
    value: string;
    closest_named_hex: string;
    exact_match_name: boolean;
    distance: number;
  };
  cmyk: {
    fraction: {
      c: number;
      m: number;
      y: number;
      k: number;
    };
    c: number;
    m: number;
    y: number;
    k: number;
    value: string;
  };
  XYZ: {
    fraction: {
      X: number;
      Y: number;
      Z: number;
    };
    X: number;
    Y: number;
    Z: number;
    value: string;
  };
  image: {
    bare: string;
    named: string;
  };
  contrast: {
    value: string;
  };
  _links: {
    self: {
      href: string;
    };
  };
  _embedded: Record<string, never>; // or `{}` if you prefer
};
