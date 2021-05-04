/***************************************************************** */
/* data generation
/***************************************************************** */


let N_HOURS = 5


function generate_hourly_data(pop_range_start = 0, pop_range_end = 1, type = null, n = N_HOURS) {
    // start with a totally random pop between pop_range_start and pop_range_end
    let pops = []
    pops[0] = Math.round(random_in_range(pop_range_start, pop_range_end) * 20) / 20

    // then decide randomly ascending or descending pop
    let isAscending = !!Math.round(Math.random())

    // 90% chance to continue ascending or descending based on that decision
    // switch to descending once hit 90%+
    // change pop by increments of 0-20%

    let decision_boundary = .8
    let max_increment = (pop_range_end - pop_range_start) / 4

    let decision = Math.random()

    for (let i = 1; i < n; i++) {
        decision = Math.random()
        increment = random_in_range(0, max_increment)

        if ((decision >= decision_boundary && isAscending) || (decision < decision_boundary && !isAscending)) {
            // ascending
            pops[i] = pops[i - 1] + increment
        } else {
            // descending
            pops[i] = pops[i - 1] - increment
        }

        if (pops[i] >= pop_range_end) { // reached max pop
            isAscending = !isAscending
            if (pops[i] > pop_range_end) {
                pops[i] = pop_range_end
            }
        }
        if (pops[i] <= pop_range_start) { // reached min pop
            isAscending = !isAscending
            if (pops[i] < pop_range_start) {
                pops[i] = pop_range_start
            }
        }
        pops[i] = Math.round(pops[i] * 20) / 20
    }

    // inches of precipitation
    let amounts = []
    let min_amount = 0
    let max_amount = .6
    let no_rain_boundary = .1

    for (let i = 0; i < pops.length; i++) {
        // if (pops[i] <= no_rain_boundary) {
        //     amounts[i] = min_amount
        // } else {
        amounts[i] = random_in_range(min_amount, max_amount) * pops[i]
        if (pops[i] >= .1) {
            amounts[i] += .05
        }
        amounts[i] = Math.round(amounts[i] * 20) / 20
        // }
    }
    return [amounts, pops]
    // return pops
}


/***************************************************************** */
/* baseline text
/***************************************************************** */

// example sentence: At 9:00 am tomorrow, there is a 30% chance of getting 0.15 inches of precipitation, which would be moderate precipitation.

function baseline_text(amounts, pops, time_index = null, time_string = null, time_offset = 13) {
    // time should be an integer between 0 and 23
    // 0 = midnight
    // 23 = 11pm 
    // etc

    // assume that time can be an index for amounts and pops

    // limit the range to the ohurs people would normally be outside
    // 9am - 8pm
    // or 1 hour after start or 1 hour before end of range if not 24 hour range

    let n = pops.length
    let earliest_time_index = 1
    let latest_time_index = n - 2

    if (n == 24) {
        earliest_time = 9
        latest_time = 20
    }

    if (time_index == null) {
        time_index = Math.round(random_in_range(earliest_time_index, latest_time_index))
        // time_string = get_time_string(time)
    }

    // let precipitation_class = classify_preciptiation(amounts[time])

    let text = 'The following describes the chance of percipitation for tomorrow:\n'
    for (let i = 0; i < n; i++) {
        if (amounts[i] > 0) {
            text += " - At " + get_time_string(i + time_offset) + ", there is a " + pops[i] + "% chance of " + classify_preciptiation(amounts[i]) + " precipitation.\n"
        } else {
            text += " - At " + get_time_string(i + time_offset) + ", there is no chance of precipitation.\n"
        }
    }


    // let text = "At " + time_string + " tomorrow, there is a " + pops[time_index]*100 + "% chance of getting " + amounts[time_index] + " inches of precipitation, which would be " + precipitation_class + " precipitation."
    return text
}


function get_time_string(time) {
    let am_pm = ':00 am'
    if (time >= 12) {
        am_pm = ':00 pm'
    }
    let time_string = (time % 12) + am_pm
    if (time == 0) {
        time_string = '12:00 am'
    } else if (time == 12) {
        time_string = '12:00 pm'
    }
    return time_string
}

function get_time_int(index) {

}


function classify_preciptiation(amount) {
    if (amount < .01) {
        return 'no'
    } if (amount < .1) {
        return 'light'
    } if (amount < .3) {
        return 'moderate'
    } else {
        return 'heavy'
    }
}


/***************************************************************** */
/* misc
/***************************************************************** */

function random_in_range(range_start = 0, range_end = 1) {
    return Math.random() * (range_end - range_start) + range_start
}


let p = generate_hourly_data()
console.log(p)
console.log(baseline_text(p[0], p[1]))