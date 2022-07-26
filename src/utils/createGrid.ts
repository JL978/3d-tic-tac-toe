export default function createGrid(): Array<Array<Array<string | 0>>> {
    return new Array(4).fill(new Array(4).fill(new Array(4).fill(0)));
}
