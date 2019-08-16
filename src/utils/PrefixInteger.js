function PrefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}
