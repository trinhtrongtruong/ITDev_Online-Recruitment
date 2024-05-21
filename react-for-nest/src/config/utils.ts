import { grey, green, blue, red, orange } from '@ant-design/colors';

export const SKILLS_LIST =
    [
        { label: "React.JS", value: "REACT.JS" },
        { label: "React Native", value: "REACT.NATIVE" },
        { label: "Vue.JS", value: "VUE.JS" },
        { label: "Angular", value: "ANGULAR" },
        { label: "NodeJS", value: "NODEJS" },
        { label: "Nest.JS", value: "NEST.JS" },
        { label: "TypeScript", value: "TYPESCRIPT" },
        { label: "JavaScript", value: "JAVASCRIPT" },
        { label: "Java", value: "JAVA" },
        { label: "Frontend", value: "FRONTEND" },
        { label: "Backend", value: "BACKEND" },
        { label: "Fullstack", value: "FULLSTACK" },
        { label: "MySQL", value: "MYSQL" },
        { label: "Spring", value: "SPRING" },
        { label: "Agile", value: "AGILE" },
        { label: "ASP.NET", value: "ASP.NET" },
        { label: "Database", value: "DATABASE" },
        { label: "AngularJS", value: "ANGULARJS" },
        { label: "Blockchain", value: "BLOCKCHAIN" },
        { label: "C#", value: "C#" },
        { label: "Crystal", value: "CRYSTAL" },
        { label: "Django", value: "DJANGO" },
        { label: "ERP", value: "ERP" },
        { label: "HTML5", value: "HTML5" },
        { label: "Japanese", value: "JAPANESE" },
        { label: "JSON", value: "JSON" },
        { label: "Magento", value: "MAGENTO" },
        { label: "NoSQL", value: "NOSQL" },
        { label: "PHP", value: "PHP" },
        { label: "Product Manager", value: "PRODUCT.MANAGER" },
        { label: "QA QC", value: "QA.QC" },
        { label: "Ruby on Rails", value: "RUBY.ON.RAILS" },
        { label: "Scrum", value: "SCRUM" },
        { label: "Solidity", value: "SOLIDITY" },
        { label: "Swift", value: "SWIFT" },
        { label: "Tester", value: "TESTER" },
        { label: "Android", value: "ANDROID" },
        { label: "Automation Test", value: "AUTOMATION.TEST" },
        { label: "Bridge Engineer", value: "BRIDGE.ENGINEER" },
        { label: "C++", value: "C++" },
        { label: "CSS", value: "CSS" },
        { label: "Flutter", value: "FLUTTER" },
        { label: "Designer", value: "DESIGNER" },
        { label: "Embedded", value: "EMBEDDED" },
        { label: "iOS", value: "IOS" },
        { label: "Kotlin", value: "KOTLIN" },
        { label: "Manager", value: "MANAGER" },
        { label: ".NET", value: ".NET" },
        { label: "Objective C", value: "OBJECTIVE.C" },
        { label: "PostgreSql", value: "POSTGRESQL" },
        { label: "Product Owner", value: "PRODUCT.OWNER" },
        { label: "Salesforce", value: "SALESFORCE" },
        { label: "Security", value: "SECURITY" },
        { label: "Solution Architect", value: "SOLUTION.ARCHITECT" },
        { label: "System Admin", value: "SYSTEM.ADMIN" },
        { label: "Wordpress", value: "WORDPRESS" },
        { label: "AWS", value: "AWS" },
        { label: "Business Analyst", value: "BUSINESS.ANALYST" },
        { label: "C language", value: "C.LANGUAGE" },
        { label: "Dart", value: "DART" },
        { label: "DevOps", value: "DEVOPS" },
        { label: "Embedded C", value: "EMBEDDED.C" },
        { label: "Games", value: "GAMES" },
        { label: "IT Support", value: "IT.SUPPORT" },
        { label: "Laravel", value: "LARAVEL" },
        { label: "MongoDB", value: "MONGODB" },
        { label: "Networking", value: "NETWORKING" },
        { label: "OOP", value: "OOP" },
        { label: "Presale", value: "PRESALE" },
        { label: "Project Manager", value: "PROJECT.MANAGER" },
        { label: "React Native", value: "REACT.NATIVE" },
        { label: "SAP", value: "SAP" },
        { label: "Sharepoint", value: "SHAREPOINT" },
        { label: "System Engineer", value: "SYSTEM.ENGINEER" },
        { label: "UI-UX", value: "UI.UX" },
        { label: "Xamarin", value: "XAMARIN" },
        { label: "Azure", value: "AZURE" },
        { label: "Business Intelligence", value: "BUSINESS.INTELLIGENCE" },
        { label: "Cloud", value: "CLOUD" },
        { label: "Data Analyst", value: "DATA.ANALYST" },
        { label: "DevSecOps", value: "DEVSECOPS" },
        { label: "English", value: "ENGLISH" },
        { label: "Golang", value: "GOLANG" },
        { label: "J2EE", value: "J2EE" },
        { label: "JQuery", value: "JQUERY" },
        { label: "Linux", value: "LINUX" },
        { label: "MVC", value: "MVC" },
        { label: "Oracle", value: "ORACLE" },
        { label: "Product Designer", value: "PRODUCT.DESIGNER" },
        { label: "Python", value: "PYTHON" },
        { label: "Ruby", value: "RUBY" },
        { label: "Scala", value: "SCALA" },
        { label: "Software Architect", value: "SOFTWARE.ARCHITECT" },
        { label: "SQL", value: "SQL" },
        { label: "Team Leader", value: "TEAM.LEADER" },
        { label: "Unity", value: "UNITY" },
    ];

export const LOCATION_LIST =
    [
        { label: "Hà Nội", value: "HANOI" },
        { label: "Hồ Chí Minh", value: "HOCHIMINH" },
        { label: "Đà Nẵng", value: "DANANG" },
        { label: "Khác", value: "OTHER" },
        { label: "Tất cả thành phố", value: "ALL" },
    ];

export const nonAccentVietnamese = (str: string) => {
    str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
}


export const convertSlug = (str: string) => {
    str = nonAccentVietnamese(str);
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
    const to = "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
    for (let i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
}

export const getLocationName = (value: string) => {
    const locationFilter = LOCATION_LIST.filter(item => item.value === value);
    if (locationFilter.length) return locationFilter[0].label;
    return 'unknown'
}

export function colorMethod(method: "POST" | "PUT" | "GET" | "DELETE" | string) {
    switch (method) {
        case "POST":
            return green[6]
        case "PUT":
            return orange[6]
        case "GET":
            return blue[6]
        case "DELETE":
            return red[6]
        default:
            return grey[10];
    }
}