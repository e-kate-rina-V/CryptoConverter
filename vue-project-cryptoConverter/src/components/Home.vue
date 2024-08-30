<template>
    <div>
        <p id="welcome" class="header-p">Welcome</p>
        <p id="to" class="header-p">to</p>
        <p id="crypto" class="header-p">Crypto</p>
        <p id="converter" class="header-p">Converter</p>
    </div>
</template>

<script>
export default {
    name: 'Home'
}
</script>

<style>
.header-p {
    position: relative;
    font-family: 'Bungee Shade', cursive;
    font-size: 50px;
    color: black;
}

#welcome {
    padding-top: 25%;
    padding-left: 30%;
}

#to {
    padding-left: 70%;
}

#crypto {
    padding-left: 70%;
    font-size: 85px;
}

#converter {
    padding-left: 105%;
    font-size: 85px;
}
</style>