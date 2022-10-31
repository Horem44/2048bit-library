const binaryHexMap = {
    "0": "0000",
    "1": "0001",
    "2": "0010",
    "3": "0011",
    "4": "0100",
    "5": "0101",
    "6": "0110",
    "7": "0111",
    "8": "1000",
    "9": "1001",
    "A": "1010",
    "B": "1011",
    "C": "1100",
    "D": "1101",
    "E": "1110",
    "F": "1111"
}

function reverse(s){
    return s.split("").reverse().join("");
}

class bigInt {
    deleteZero(num){
        let pos = 0;
        for (let i = 0; i < num.length; i++) {
            if (num[i] !== "0") {
                pos = i;
                break;
            }
        }
        return pos;
    }

    addZero(num1, num2){
        num1 = "0".repeat(num2.length - num1.length) + num1;
        return num1;
    }

    shiftDigitsToHigh(num, i) {
        return num + "0".repeat(i);
    }

    hexToBinary(num) {
        let numInBin = "";
        for (let i = 0; i < num.length; i++) {
            numInBin += binaryHexMap[num[i]];
        }

        if(num === "0") return "0";
        return (numInBin).slice(this.deleteZero(numInBin),);
    }

    binaryToHex(num) {
        let numInHex = "";
        let remainder = num.length % 4;

        if (remainder !== 0)
            num = "0".repeat(4 - remainder) + num;

        for (let i = 0; i < num.length; i += 4) {
            numInHex += Object.keys(binaryHexMap).find(key =>
                binaryHexMap[key] === (num[i] + num[i + 1] + num[i + 2] + num[i + 3]));
        }

        return numInHex.slice(this.deleteZero(numInHex), );
    }

    sumBin(num1, num2) {
        let carry = 0;
        let temp;
        let result = "";
        let maxlength = Math.max(num1.length, num2.length);

        if(num1.length < num2.length)
            num1 = this.addZero(num1, num2);
        else
            num2 = this.addZero(num2, num1);

        num1 = reverse(num1);
        num2 = reverse(num2);

        for(let i = 0; i < maxlength; i++){
            temp = (+num1[i]) + (+num2[i]) + carry;
            result += (temp & 1);
            carry = temp >> 1;
        }

        return reverse(result + carry);
    }

    sum(num1, num2){
        num1 = this.hexToBinary(num1);
        num2 = this.hexToBinary(num2);
        return this.binaryToHex(this.sumBin(num1, num2));
    }

    compareBin(num1, num2){
        let maxlength = Math.max(num1.length, num2.length);

        if(num1.length < num2.length)
            num1 = this.addZero(num1, num2);
        else
            num2 = this.addZero(num2, num1);

        for(let i = 0; i < maxlength; i++){
            if(num1[i] > num2[i])
                return 1;
            else if(num2[i] > num1[i])
                return -1;
        }

        return 0;
    }

    subBin(num1, num2){
        let borrow = 0;
        let temp;
        let result = "";
        let maxlength = Math.max(num1.length, num2.length);

        if(num1.length < num2.length)
            num1 = this.addZero(num1, num2);
        else
            num2 = this.addZero(num2, num1);

        num1 = reverse(num1);
        num2 = reverse(num2);

        for(let i = 0; i < maxlength; i++){
            temp = (+num1[i]) - (+num2[i]) - borrow;
            if(temp >= 0){
                result += temp;
                borrow = 0;
            }else{
                result += 2 + temp;
                borrow = 1;
            }
        }
        return reverse(result + borrow);
    }

    sub(num1, num2){
        num1 = this.hexToBinary(num1);
        num2 = this.hexToBinary(num2);
        if(this.compareBin(this.hexToBinary(num1), this.hexToBinary(num2)) === -1) return "Negative Number";
        return this.binaryToHex(this.subBin(num1, num2));
    }

    mulBin(num1, num2){
        let result = "0";
        let numMax;
        let numMin;
        if(this.compareBin(num1, num2) === 1){
            numMax = num1;
            numMin = num2;
        }else if(this.compareBin(num1, num2) === -1){
            numMax = num2;
            numMin = num1;
        }else{
            numMax = num1;
            numMin = numMax;
        }

        for(let i = 0; i < numMax.length; i++){
            if(numMin[i] === "1") {
                result = this.sumBin(result, this.shiftDigitsToHigh(numMax, numMin.length - i - 1));
            }
        }

        if(result.length > 2048) {
            result = result.slice(result.length - 2048,);
        }

        return result;
    }

    mul(num1, num2){
        if(num1.length > 512) {
            num1 = num1.slice(num1.length - 512,);
        }
        if(num2.length > 512) {
            num2 = num2.slice(num2.length - 512,);
        }

        num1 = this.hexToBinary(num1);
        num2 = this.hexToBinary(num2);
        return this.binaryToHex(this.mulBin(num1, num2));
    }

    divBin(num1, num2){
        let result = "";
        let r = "";

        for(let i = 0; i < num1.length; i++){
            if(this.compareBin(r, num2) === 1 || this.compareBin(r, num2) === 0)
                break;

            r += num1[i];

            if(this.compareBin(r, num2) === -1){
                result += 0;
            }else{
                r = this.subBin(r, num2);
                result += 1;
            }
        }

        return [result, r];
    }

    div(num1, num2){
        num1 = this.hexToBinary(num1);
        num2 = this.hexToBinary(num2);
        return [this.binaryToHex(this.divBin(num1, num2)[0]), this.binaryToHex(this.divBin(num1, num2)[1])];
    }

    power(num1, num2){
        let result = "1";
        let num2Bin = (this.hexToBinary(num2));
        let lastStep = num2Bin.length - 1;

        for(let i = 0; i < num2Bin.length; i++){
            if(num2Bin[i] === "1") {
                result = this.mul(result, num1);
            }
            if(i !== lastStep){
                result = this.mul(result, result);
            }
        }

        return result;
    }

}


let big = new bigInt();
//console.log(big.mul("D4D2110984907B5625309D956521BAB4157B8B1ECE04043249A3D379AC112E5B9AF44E721E148D88A942744CF56A06B92D28A0DB950FE4CED2B41A0BD38BCE7D0BE1055CF5DE38F2A588C2C9A79A75011058C320A7B661C6CE1C36C7D870758307E5D2CF07D9B6E8D529779B6B2910DD17B6766A7EFEE215A98CAC300F2827DB", "3A7EF2554E8940FA9B93B2A5E822CC7BB262F4A14159E4318CAE3ABF5AEB1022EC6D01DEFAB48B528868679D649B445A753684C13F6C3ADBAB059D635A2882090FC166EA9F0AAACD16A062149E4A0952F7FAAB14A0E9D3CB0BE9200DBD3B0342496421826919148E617AF1DB66978B1FCD28F8408506B79979CCBCC7F7E5FDE7"));
console.log(big.div("30A120B609DCBE28B09CA92E12DD29D77AE6400DC22B026AFB5FB945AAF62B57F4E48BD299261F02BBB35DD2495B5CD2713BF0E30192DAE1B334659160C8552423F0AD7FB82870920DF4E9B57980EAD2ADA9F3EF4B5D0718AB7F1053700395278998CB9AD48498D65150E3E837B0BB169D432B441424557061F838A17C65F90A31105F599BF69B87485BF9C70F51D37A417E476E372558C26782AC8C8F35C3D1227E851D8A72CD708700FD90C5E17F22C4EA15730345E56BD76F04B54580813CBE306B4404C6F34BCD9840D2911E6B3CF6DE3EE428C274EDF0A97335D8256DA26FCD67BA5450593A15F6B527ECE76FBBE20F7A882347614AF4B7FAF55086659D", "3A7EF2554E8940FA9B93B2A5E822CC7BB262F4A14159E4318CAE3ABF5AEB1022EC6D01DEFAB48B528868679D649B445A753684C13F6C3ADBAB059D635A2882090FC166EA9F0AAACD16A062149E4A0952F7FAAB14A0E9D3CB0BE9200DBD3B0342496421826919148E617AF1DB66978B1FCD28F8408506B79979CCBCC7F7E5FDE7"));

/********************************************/
//Distributivity (a+b)*c = c*(a+b) = a*c + c*b
let result;

let a = "D4D2110984907B5625309D956521BAB4157B8B1ECE04043249A3D379AC112E5B9AF44E721E148D88A942744CF56A06B92D28A0DB950FE4CED2B41A0BD38BCE7D0BE1055CF5DE38F2A588C2C9A79A75011058C320A7B661C6CE1C36C7D870758307E5D2CF07D9B6E8D529779B6B2910DD17B6766A7EFEE215A98CAC300F2827DB";
let b = "87D6D58D3991D536544389CEFA72FD0EBED75B2EBDC2C79BC3717793108F0952011E7E2D7040FFFB32F10BEB8ED0A485026B6860020B230128A8222B0525A6888942FB01C537800BF25D6F021D4B99D3CBD6DF9055FA22F91A6CFC4FDFC408AEF78F6418D3CE4E20EC7888B61BAE3D73C27C257CCA905DE0353C3A7CFFD9FE15";
let c = "170076B15F9575D21DE39D5C429799BBCDDB867016DE2248E3CFDE73A4D70C8636A9E41ABE671E7B9FB4739A5FF64DF9D0D3A64E0C9B20BFE58F1C62B28477EE9FD202010BAC440ADF3CA016A32DB844F23DEC2AB93AE869A6262FC23C5CE419807CDBA930A5433884E3B34B22477289BD3A7712CDD4B4110BD9887E7428FDF7";

//(a+b)*c
result = big.mul(big.sum(a,b), c);
console.log(result + '\n');

//c*(a+b)
result = big.mul(c, big.sum(a,b));
console.log(result + '\n');

//a*c + c*b
result = big.sum(big.mul(a,c), big.mul(b,c));
console.log(result + '\n');
/********************************************/

/********************************************/
//(a+a+a+....+a) = a*n
//     n

a = "8703A1E982F278420C2D60CA7A0ED76C91855E3147B50357074A04EAF6515F07C1D8967674C7577D4112652E8135D145329F0DAE738F75C35004A154F1C43449DB87B6BE0F3EBF5B3BA1016F0A04A10C7EA76C3D30EEDB34B1E6E1009B3FF5C987FA313097485E6F8C78744E2F49DF62D13AD204E00F731BAE0E085C353D8D75";
result = "0";
let n = 3;

for(let i = 0; i < n; i++){
    result = big.sum(a, result);
}
console.log(result + '\n');

result = big.mul(a, n.toString());
console.log(result);
