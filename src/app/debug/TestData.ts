// 用于测试的数据
// 以一年内的社群的数据为一份，每一份内为一个表，每一行为一直猴子的数据， 每一列为一个猴子的所有属性值
// 除了以上这个表，还有一个表，用于记录所有单元的信息
// 每一只猴子的属性有：ID、name、genda、birthDate、father、mother
// 其中father、mother 均用父、母的ID表示
// 示例：某一个年份的猴子信息
// ID       name        genda       birthDate       father      mother      unit
//  1        zq          FEMALE      1998/7/23         1           4         1
//  2        gzy         MALE        1997/2/5          5           6         2
//  3        zrq         MALE        1974/1/1         -1           -1        2
//  4        yhj         FEMALE      1975/1/1         -1           -1        2
//  5        gsz         MALE        1961/12/30       -1           -1        1
//  6        sjm         FEMALE      1974/1/1         -1           -1        1

import { GENDA } from "../commons/basis";

// 单元的信息示例如下：
// ID       name        createdDate         vanishDate
// 1         qhc          1900/1/1              -1
// 2         sx           1900/1/1              -1

var monkeysData = {
    2016:[
        {"ID":1, "name":"", "genda":GENDA.MALE, "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":2, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":3, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":4, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":5, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":6, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":7, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":8, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":9, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":10, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":11, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":12, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":13, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":14, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":15, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":16, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":17, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
    ],
    2017:[
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
    ],
    2018:[
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
    ],
    2019:[
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
    ],
    2020:[
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
    ]

}

var unitsData = {

}

exports.monkeysData = monkeysData;
exports.unitsData = unitsData;