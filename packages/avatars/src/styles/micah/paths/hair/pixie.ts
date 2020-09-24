type Props = {
  color: string;
};

export default ({ color }: Props) => `
  <g stroke="#000">
    <path d="M105.837 88.82c1.888.297 1.888.299 1.887.3v.004l-.001.007-.003.018a.813.813 0 00-.009.05l-.031.157a11.69 11.69 0 01-.125.528 20.355 20.355 0 01-.6 1.894c-.595 1.625-1.626 3.958-3.393 6.923-3.17 5.317-8.702 12.658-18.316 21.589 29.97.747 55.004-8.908 72.821-19.033 9.361-5.32 16.712-10.759 21.717-14.863a118.433 118.433 0 005.698-4.965 74.331 74.331 0 001.804-1.742c.039-.04.067-.07.086-.088l.019-.02.004-.004h0l2.282-2.374.929 3.16-1.834.538 1.834-.538.001.002.002.009.01.034.039.132.152.52.581 1.993a2171.99 2171.99 0 018.771 31.058c5.027 18.348 10.604 39.815 12.693 51.971 3.493 20.318-1.908 35.744-5.102 44.869-.621 1.774-1.159 3.31-1.531 4.597.053.045.123.1.214.165.597.423 1.656.911 3.187 1.397 3.015.959 7.319 1.745 11.921 2.188 4.594.442 9.377.532 13.338.146 1.982-.194 3.705-.502 5.075-.92 1.316-.402 2.14-.857 2.585-1.268.013-.086.031-.291-.019-.688-.098-.776-.405-1.868-.937-3.313-.793-2.157-1.969-4.798-3.344-7.885a820.46 820.46 0 01-1.46-3.294c-3.929-8.939-8.656-20.564-9.686-32.408-1.144-13.161 1.457-24.416 3.794-34.533l.111-.482c2.388-10.34 4.375-19.319 2.335-28.419-3.096-13.81-7.319-25.308-13.804-33.57-6.417-8.174-15.12-13.276-27.496-14.214l-1.278-.096-.395-1.22c-5.695-17.57-13.383-29.051-23.186-36.17-9.8-7.117-21.956-10.051-36.939-10.051-27.688 0-57.503 10.52-79.878 28.718-22.351 18.18-37.143 43.896-35.208 74.334 2.136 33.591-.298 59.061-5.788 77.712-5.006 17.007-12.593 28.466-21.688 35.15 1.194.609 2.784 1.383 4.771 2.269 5.027 2.24 12.591 5.198 22.674 8.027 19.334 5.425 47.945 10.38 85.711 8.887-8.325-7.151-16.723-15.828-23.374-25-7.633-10.527-13.135-21.943-13.296-32.575-.191-12.627.664-45.668.928-52.507.615-15.896 10.822-28.15 20.538-36.3 4.887-4.099 9.728-7.228 13.344-9.331a87.365 87.365 0 014.38-2.39c.53-.27.949-.474 1.239-.612l.208-.099a24.4 24.4 0 01.126-.058l.09-.042.025-.011.007-.004h.003c.001-.001.001-.001.787 1.74zm0 0l1.888.297.551-3.494-3.225 1.455.786 1.742zm100.231 126.568c.003 0 .014.014.029.04-.024-.027-.031-.04-.029-.04z" fill="${color}" stroke-width="3.822"/>
    <path d="M191 58c.5 4.5-.3 13.5-1.5 19.5" stroke-width="4"/>
  </g>
`;